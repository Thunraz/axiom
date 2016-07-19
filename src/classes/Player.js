'use strict';
define(
    [
        'three',
        'SpaceShip',
        'Debug'
    ],
    function(THREE, SpaceShip, Debug) {
        return class Player extends SpaceShip {
            
            // ##############################################
            // # Constructor ################################
            // ##############################################

            constructor(scene, name, mass, position) {
                super(scene, name, mass, position, 'assets/models/ship.json');

                this.accelerationChange = new THREE.Vector3(0, 0, 0);
            }
            
            // ##############################################
            // # Public functions ###########################
            // ##############################################

            accelerate() {
                this.accelerationChange.x = .0001;
            }

            // ##############################################

            decelerate() {
                this.accelerationChange.x = -.0001;
            }

            // ##############################################

            turnLeft() {
                
            }

            // ##############################################

            turnRight() {
                
            }

            // ##############################################

            update(deltaT, smoothDeltaT, spaceObjects) {
                super.update(deltaT, smoothDeltaT, spaceObjects);

                Debug.log(
                    Math.round(this.acceleration.x * 10000) / 10000 + ' ' +
                    Math.round(this.acceleration.y * 10000) / 10000 + ' ' +
                    Math.round(this.acceleration.z * 10000) / 10000
                );
            }

            // ##############################################

            force(position, mass, id, gameObjects) {
                let vec = super.force(position, mass, id, gameObjects);

                vec.x += this.accelerationChange.x;

                this.accelerationChange.set(0, 0, 0);

                return vec;
            }
        }
    }
);