'use strict';
define(
    ['app/classes/SpaceObject'],
    function(SpaceObject) {
        return class AstronomicalObject extends SpaceObject {
            constructor() {
                super();
                
                this.mass         = 0.0;

                this.velocity     = new THREE.Vector3(0.0, 0.01, 0.0);
                this.acceleration = new THREE.Vector3(0.0, 0.0, 0.0);

                this.counter = 0;
            }

            updatePosition(time, deltaT, spaceObjects) {
                /*
                Velocity Verlet:

                acceleration = force(time, position) / mass;
                time += timestep;
                position += timestep * (velocity + timestep * acceleration / 2);
                newAcceleration = force(time, position) / mass;
                velocity += timestep * (acceleration + newAcceleration) / 2;

                */
                this.acceleration = this.force(time, this.position, spaceObjects).divideScalar(this.mass);

                this.position = this.position.add(
                    this.velocity.add(this.acceleration.divideScalar(2))
                );

                let newAcceleration = this.force(time, this.position, spaceObjects).divideScalar(this.mass);
                this.velocity = this.velocity.add(
                    this.acceleration.add(newAcceleration).multiplyScalar(deltaT / 2)
                );

                /*if (this.counter <= 10) {
                    //console.log(this.name);
                    console.log(this.velocity);
                    this.counter++;
                }*/
            }

            force(time, position) {
                return new THREE.Vector3(-position.x / time, -position.y / time, 0.0);
            }
        }
    }
);