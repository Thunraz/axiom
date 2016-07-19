'use strict';
define(
    ['three', 'SpaceObject'],
    function(THREE, SpaceObject) {
        return class TrailParticle extends SpaceObject {

            // ##############################################
            // # Constructor ################################
            // ##############################################

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

            // ##############################################
            // # Private functions ##########################
            // ##############################################

            _createMesh() {
                let size = this.size;
                if(size < 0.5) size = 0.5;

                let geometry = new THREE.PlaneGeometry(size, size, 1, 1);
                let material = new THREE.MeshBasicMaterial({color: this.color, transparent: true});
                
                this.mesh = new THREE.Mesh(geometry, material);
                this.mesh.position.set(this.position.x, this.position.y, this.position.z);
            }

            // ##############################################
            // # Public functions ###########################
            // ##############################################

            update(deltaT) {
                super.update(deltaT);

                if(this.life <= this.lifetime) {
                    this.mesh.lookAt(this.scene.camera.camera.position);

                    let factor = 1 - this.life / this.lifetime / 50;

                    // Fade to black (alpha not available)
                    this.mesh.material.color.r *= factor;
                    this.mesh.material.color.g *= factor;
                    this.mesh.material.color.b *= factor;

                    this.mesh.material.opacity *= factor;

                    this.life += deltaT / 1000;
                } else {
                    this.alive = false;
                    this.scene.remove(this.mesh);
                    this.mesh.material.dispose();
                    this.mesh.geometry.dispose();
                    this.mesh  = null;
                }
            }

            // ##############################################

        } // class
    }
);