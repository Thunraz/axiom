'use strict';
define(
    ['three', 'app/classes/AstronomicalObject', 'app/classes/AstronomicalObjectType'],
    function(THREE, AstronomicalObject, AstronomicalObjectType) {
        return class Star extends AstronomicalObject {

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
            }

            _createLight() {
                this.light = new THREE.PointLight( 0x111111, 4 * Math.PI, 100 );
                this.light.position.set(this.position.x, this.position.y, this.position.z);
                this.scene.add(this.light);
            }
            
            _createMesh() {
                let geometry = new THREE.SphereGeometry(this.radius / 100, 32, 32);
                let material = new THREE.MeshPhongMaterial({
                    emissive: this.color
                });
                
                this.mesh = new THREE.Mesh(geometry, material);
                this.mesh.position.set(this.position.x, this.position.y, this.position.z);
                this.scene.add(this.mesh);
            }

            update(deltaT, time, spaceObjects) {
                super.update(deltaT, time, spaceObjects);
                
                this.mesh.position.set(this.position.x, this.position.y, this.position.z);
                this.light.position.set(this.position.x, this.position.y, this.position.z);
            }
        }
    }
);