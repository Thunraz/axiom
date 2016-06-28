'use strict';
define(
    ['three', 'app/classes/astronomicalObject', 'app/classes/astronomicalObjectType'],
    function(THREE, AstronomicalObject, AstronomicalObjectType) {
        return class Planet extends AstronomicalObject {

            get mesh() { return this._mesh; }

            constructor(name, mass, radius, position, isSolid, color) {
                super();

                this.name     = name;
                this.mass     = mass;
                this.radius   = radius;
                this.position = position;
                this.color    = color;
                
                this._mesh    = null;
                
                if(isSolid) {
                    this.astronomicalObjectType = AstronomicalObjectType.SOLID;
                } else {
                    this.astronomicalObjectType = AstronomicalObjectType.GAS;
                }

                this._createMesh();
            }
            
            _createMesh() {
                let geometry = new THREE.SphereGeometry(this.radius / 100, 32, 32);
                let material = new THREE.MeshPhongMaterial({color: this.color});
                
                this._mesh = new THREE.Mesh(geometry, material);
                this._mesh.position.x = this.position.x;
                this._mesh.position.y = this.position.y;
                this._mesh.position.z = this.position.z;
            }
        }
    }
);