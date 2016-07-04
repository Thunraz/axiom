'use strict';
define(
    ['app/classes/SpaceObject', 'app/classes/Constants'],
    function(SpaceObject, Constants) {
        return class AstronomicalObject extends SpaceObject {

            // ##############################################
            // # Constructor ################################
            // ##############################################
            
            constructor() {
                super();
                
                this.mass         = 0.0;

                this.velocity     = new THREE.Vector3(0.0, 0.0, 0.0);
                this.acceleration = new THREE.Vector3(0.0, 0.0, 0.0);
            }

            // ##############################################
            // # Public functions ###########################
            // ##############################################

            updatePosition(deltaT, spaceObjects) {
                this.acceleration = AstronomicalObject.force(this.position, this.mass, this.id, spaceObjects).divideScalar(this.mass);

                this.position = this.position.add(
                    this.velocity
                        .add(this.acceleration.multiplyScalar(deltaT / 2))
                );
            }

            // ##############################################

            update(deltaT, spaceObjects) {
                super.update(deltaT, spaceObjects);

                let newAcceleration = AstronomicalObject.force(this.position, this.mass, this.id, spaceObjects).divideScalar(this.mass);
                this.velocity = this.velocity.add(
                    this.acceleration.add(newAcceleration).multiplyScalar(deltaT)
                );
            }

            // ##############################################
            // # Static functions ###########################
            // ##############################################

            static force(position, mass, id, spaceObjects) {
                let vec = new THREE.Vector3(0, 0, 0);

                for(let i = 0; i < spaceObjects.length; i++) {
                    let spaceObject = spaceObjects[i];

                    if(spaceObject.id == id) continue;

                    let distance = position.distanceTo(spaceObject.position);
                    let val = Constants.GRAVITATIONAL_CONSTANT * (mass * spaceObject.mass) / Math.pow(distance, 2);

                    let direction =
                        new THREE.Vector3(0, 0, 0)
                        .subVectors(spaceObject.position, position)
                        .normalize()
                        .multiplyScalar(val);

                    vec.add(direction);
                }
                return vec;
            }

            // ##############################################

        } // class
    }
);