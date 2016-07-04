'use strict';
define(
    ['three', 'app/classes/AstronomicalObject', 'app/classes/AstronomicalObjectType', 'app/config'],
    function(THREE, AstronomicalObject, AstronomicalObjectType, config) {
        return class Star extends AstronomicalObject {

            // ##############################################
            // # Constructor ################################
            // ##############################################

            constructor(scene, name, mass, radius, position, color) {
                super();

                this.scene    = scene;

                this.name     = name;
                this.mass     = mass;
                this.radius   = radius;
                this.position = position;
                this.color    = color;
                
                this.astronomicalObjectType = AstronomicalObjectType.STAR;

                this._createLight();
                this._createMesh();

                if(config.showDirectionalVectors) {
                    this.arrowMesh = this._createDirectionalArrow();
                    this.scene.add(this.arrowMesh);
                }
            }

            // ##############################################
            // # Private functions ##########################
            // ##############################################

            _createLight() {
                this.light = new THREE.PointLight( 0x111111, 4 * Math.PI, 100 );
                this.light.position.set(this.position.x, this.position.y, this.position.z);
                this.scene.add(this.light);
            }

            // ##############################################
            
            _createMesh() {
                let geometry = new THREE.SphereGeometry(this.radius / 100, 32, 32);
                let material = new THREE.MeshPhongMaterial({
                    emissive: this.color
                });
                
                this.mesh = new THREE.Mesh(geometry, material);
                this.mesh.position.set(this.position.x, this.position.y, this.position.z);
                this.scene.add(this.mesh);
            }

            // ##############################################
            // # Public functions ###########################
            // ##############################################

            update(deltaT, spaceObjects) {
                super.update(deltaT, spaceObjects);
                
                this.mesh.position.set(this.position.x, this.position.y, this.position.z);
                this.light.position.set(this.position.x, this.position.y, this.position.z);
            }

            // ##############################################

        } // class
    }
);