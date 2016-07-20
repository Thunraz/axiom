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

            constructor(scene, name, options) {
                if(!scene || !name || !options) {
                    throw new Error('Star has not been initialized properly.');
                }

                options.model = 'assets/models/ship.json';

                super(scene, name, options);

                this.accelerationChange = new THREE.Vector3(0, 0, 0);
            }
            
            // ##############################################
            // # Public functions ###########################
            // ##############################################

            accelerate() {
                this.accelerationChange.x = 2E-24;
            }

            // ##############################################

            decelerate() {
                this.accelerationChange.x = -2E-24;
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