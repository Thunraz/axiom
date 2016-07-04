'use strict';
define(
    ['app/classes/SpaceObject', 'app/classes/Constants'],
    function(SpaceObject, Constants) {
        return class AstronomicalObject extends SpaceObject {
            constructor() {
                super();
                
                this.mass         = 0.0;

                this.velocity     = new THREE.Vector3(0.0, 0.0, 0.0);
                this.acceleration = new THREE.Vector3(0.0, 0.0, 0.0);

                this.counter = 0;
            }

            updatePosition(deltaT, spaceObjects) {
                /*
                Velocity Verlet:

                acceleration = force(time, position) / mass;
                time        += timestep;
                position    += timestep * (velocity + timestep * acceleration / 2);
                */

                this.acceleration = this.force(this.position, spaceObjects).divideScalar(this.mass);

                this.position = this.position.add(
                    this.velocity
                        .add(this.acceleration.multiplyScalar(deltaT / 2))
                        //.multiplyScalar(deltaT)
                );
            }

            update(deltaT, spaceObjects) {
                super.update(deltaT, spaceObjects);

                /*
                Velocity Verlet again:

                newAcceleration = force(time, position) / mass;
                velocity += timestep * (acceleration + newAcceleration) / 2;
                */

                let newAcceleration = this.force(this.position, spaceObjects).divideScalar(this.mass);
                this.velocity = this.velocity.add(
                    this.acceleration.add(newAcceleration).multiplyScalar(deltaT)
                );

                this.counter++;
            }

            force(position, spaceObjects) {
                let vec = new THREE.Vector3(0, 0, 0);

                for(let i = 0; i < spaceObjects.length; i++) {
                    let spaceObject = spaceObjects[i];

                    if(spaceObject == this) continue;

                    let distance = position.distanceTo(spaceObject.position);
                    let val = Constants.GRAVITATIONAL_CONSTANT * (this.mass * spaceObject.mass) / Math.pow(distance, 2);

                    let direction =
                        new THREE.Vector3(0, 0, 0)
                        .subVectors(spaceObject.position, position)
                        .normalize()
                        .multiplyScalar(val);

                    vec.add(direction);
                }
                return vec;
            }

        }
    }
);