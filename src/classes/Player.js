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
            }
            
            // ##############################################
            // # Public functions ###########################
            // ##############################################

            accelerate() {
                this.acceleration.x += 1;
            }

            // ##############################################

            decelerate() {

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

                Debug.log(this.acceleration);
            }
        }
    }
);