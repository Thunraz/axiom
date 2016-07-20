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
                if(!scene || !name || !options || typeof(options) !== 'object') {
                    throw new Error('Player has not been initialized properly.');
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
                // Get the angle in radians so we can add to it
                let angle = Math.atan2(this.orientation.y, this.orientation.x);                
                angle += 180 / Math.PI / 360 / 30;

                this.orientation.x = Math.cos(angle);
                this.orientation.y = Math.sin(angle);
            }

            // ##############################################

            turnRight() {
                // Get the angle in radians so we can add to it
                let angle = Math.atan2(this.orientation.y, this.orientation.x);                
                angle -= 180 / Math.PI / 360 / 30;

                this.orientation.x = Math.cos(angle);
                this.orientation.y = Math.sin(angle);
            }

            // ##############################################

            update(deltaT, smoothDeltaT, spaceObjects) {
                super.update(deltaT, smoothDeltaT, spaceObjects);

                Debug.log(this.orientation);

                Debug.log(
                    Math.round(this.acceleration.x * 10000) / 10000 + ' ' +
                    Math.round(this.acceleration.y * 10000) / 10000 + ' ' +
                    Math.round(this.acceleration.z * 10000) / 10000
                );
            }

            // ##############################################

            force(position, mass, id, gameObjects) {
                let vec = super.force(position, mass, id, gameObjects);

                vec.add(this.accelerationChange.multiply(this.orientation));

                this.accelerationChange.set(0, 0, 0);

                return vec;
            }
        }
    }
);