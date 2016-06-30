'use strict';
define(
    ['three', 'app/classes/astronomicalObject', 'app/classes/astronomicalObjectType'],
    function(THREE, AstronomicalObject, AstronomicalObjectType) {
        return class Planet extends AstronomicalObject {

            constructor(scene, name, mass, radius, position, isSolid, color) {
                super();

                this.scene    = scene;

                this.name     = name;
                this.mass     = mass;
                this.radius   = radius;
                this.position = position;
                this.color    = color;
                
                this.mesh     = null;
                
                if(isSolid) {
                    this.astronomicalObjectType = AstronomicalObjectType.SOLID;
                } else {
                    this.astronomicalObjectType = AstronomicalObjectType.GAS;
                }

                this._createMesh();

                this.scene.add(this.mesh);
            }
            
            _createMesh() {
                let geometry = new THREE.SphereGeometry(this.radius / 100, 32, 32);
                let material = new THREE.MeshPhongMaterial({color: this.color});
                
                this.mesh = new THREE.Mesh(geometry, material);
                this.mesh.position.set(this.position.x, this.position.y, this.position.z);
            }

            update(deltaT) {
                this.mesh.position.set(this.position.x, this.position.y, this.position.z);
            }
        }
    }
);