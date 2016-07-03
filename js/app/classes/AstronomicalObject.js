'use strict';
define(
    ['app/classes/SpaceObject', 'app/classes/Constants'],
    function(SpaceObject, Constants) {
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

                this.acceleration = this.force(time, spaceObjects).divideScalar(this.mass);

                this.position = this.position.add(
                    this.velocity.add(this.acceleration.divideScalar(2))
                );

                let newAcceleration = this.force(time, spaceObjects).divideScalar(this.mass);
                this.velocity = this.velocity.add(
                    this.acceleration.add(newAcceleration).multiplyScalar(deltaT / 2)
                );
            }

            force(time, spaceObjects) {
                let vec = new THREE.Vector3(0, 0, 0);

                for(let i = 0; i < spaceObjects.length; i++) {
                    let spaceObject = spaceObjects[i];

                    if(spaceObject == this) continue;

                    let distance = this.position.distanceTo(spaceObject.position);
                    let val = Constants.GRAVITATIONAL_CONSTANT * (this.mass * spaceObject.mass) / Math.pow(distance, 2);

                    let direction = spaceObject.position.sub(this.position);

                    vec.set(
                        vec.x * direction.x * val,
                        vec.y * direction.y * val,
                        vec.z * direction.z * val
                    );

                    if(this.counter < 10) {
                        console.log(this.name + '; distance: ', distance, '; direction: ', direction, '; vec: ', vec);

                        this.counter++;
                    }
                }
                
                //return new THREE.Vector3(-position.x / 1000, -position.y / 1000, 0.0);
                return vec;
            }

        }
    }
);