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
            }

            force(time, position, spaceObjects) {
                for(let i = 0; i < spaceObjects.length; i++) {
                    if(spaceObjects[i] == this) continue;
                    let spaceObject = spaceObjects[i];

                    let distance = this.calculateDistance(position, spaceObject.position);
                }
                
                return new THREE.Vector3(-position.x / 1000, -position.y / 1000, 0.0);
            }

            calculateDistance(pos1, pos2) {
                let x = Math.pow(pos2.x - pos1.x, 2);
                let y = Math.pow(pos2.y - pos1.y, 2);
                let z = Math.pow(pos2.z - pos1.z, 2);

                return Math.sqrt(x + y + z);
            }

        }
    }
);