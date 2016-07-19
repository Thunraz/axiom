'use strict';
define(
    [
        'three',
        'SpaceShip'
    ],
    function(THREE, SpaceShip) {
        return class Player extends SpaceShip {
            
            // ##############################################
            // # Constructor ################################
            // ##############################################

            constructor(scene, name, mass, position) {
                super(scene, name, mass, position, 'assets/models/ship.json');
            }
        }
    }
);