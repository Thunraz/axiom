'use strict';
define(
    ['three', 'app/classes/SpaceObject'],
    function(THREE, SpaceObject) {
        return class TrailParticle extends SpaceObject {
            constructor(scene, parent, position, size, lifetime) {
                super();

                this.scene    = scene;

                this.size     = size;
                this.position = position;
                this.color    = parent.color;

                this.lifetime = lifetime;
                this.life     = 0.0;
                this.alive    = this.life < this.lifetime;
                
                this.mesh     = null;
                this._createMesh();
                this.scene.add(this.mesh);
            }

            _createMesh() {
                let geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
                let material = new THREE.MeshBasicMaterial({color: this.color});
                
                this.mesh = new THREE.Mesh(geometry, material);
                this.mesh.position.set(this.position.x, this.position.y, this.position.z);
            }

            update(deltaT, time, spaceObjects) {
                if(this.life <= this.lifetime) {
                    let factor = 1 - this.life / this.lifetime / 50;

                    // Fade to black (alpha not available)
                    this.mesh.material.color.r *= factor;
                    this.mesh.material.color.g *= factor;
                    this.mesh.material.color.b *= factor;

                    this.life += deltaT / 1000;
                } else {
                    this.alive = false;
                    this.scene.remove(this.mesh);
                }
            }

        }
    }
);