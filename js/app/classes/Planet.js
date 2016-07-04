'use strict';
define(
    ['three', 'app/classes/AstronomicalObject', 'app/classes/AstronomicalObjectType', 'app/classes/TrailParticle'],
    function(THREE, AstronomicalObject, AstronomicalObjectType, TrailParticle) {
        return class Planet extends AstronomicalObject {

            constructor(scene, name, mass, radius, position, isSolid, color) {
                super();

                this.scene        = scene;

                this.name         = name;
                this.mass         = mass;
                this.radius       = radius;
                this.position     = position;
                this.color        = color;

                this.trail        = [];

                this.frameCounter = 0;
                
                this._createMesh();
                
                if(isSolid) {
                    this.astronomicalObjectType = AstronomicalObjectType.SOLID;
                } else {
                    this.astronomicalObjectType = AstronomicalObjectType.GAS;
                }
            }
            
            _createMesh() {
                let geometry = new THREE.SphereGeometry(this.radius / 100, 32, 32);
                let material = new THREE.MeshPhongMaterial({color: this.color});
                
                this.mesh = new THREE.Mesh(geometry, material);
                this.mesh.position.set(this.position.x, this.position.y, this.position.z);
                
                this.mesh.name = this.name;
                this.scene.add(this.mesh);
            }

            update(deltaT, spaceObjects) {
                super.update(deltaT, spaceObjects);

                this.frameCounter++;

                this.mesh.position.set(this.position.x, this.position.y, this.position.z);

                if(this.frameCounter % 10 == 0) {
                    if(this.trail.length < 100) {
                        this.trail.push(new TrailParticle(this.scene, this, this.position, this.radius / 200, 10));
                    }
                }

                for(let i = 0; i < this.trail.length; i++) {
                    this.trail[i].update(deltaT);
                }

                this.trail = this.trail.filter((value) => { return value.alive });
            }
        }
    }
);