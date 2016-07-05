'use strict';
define(
    ['three', 'app/classes/AstronomicalObject', 'app/classes/AstronomicalObjectType', 'app/config'],
    function(THREE, AstronomicalObject, AstronomicalObjectType, config) {
        return class SpaceShip extends AstronomicalObject {

            // ##############################################
            // # Constructor ################################
            // ##############################################

            constructor(scene, name, mass, position) {
                super();

                this.scene = scene;
                this.name  = name;

                let loader = new THREE.ObjectLoader();
                loader.load('assets/models/ship.json', function(geometry, materials) {
                    let material = new THREE.MultiMaterial(materials);
                    let object   = new THREE.Mesh(geometry, material);
                    scene.add(object);
                });
            }

            // ##############################################
            // # Public functions ###########################
            // ##############################################
        }
    }
);