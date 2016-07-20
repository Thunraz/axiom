'use strict';
define(
    ['three', 'SpaceObject'],
    function(THREE, SpaceObject) {
        return class Grid extends SpaceObject {

            // ##############################################
            // # Constructor ################################
            // ##############################################

            constructor(scene, name, options) {
                super();

                this.scene = scene;
                this.name  = name;

                this.position       = options.position       || new THREE.Vector3();
                this.width          = options.width          || 750;
                this.height         = options.height         || 750;
                this.segments       = options.segments       || 60;
                this.moveWithCamera = options.moveWithCamera || false;

                if(this.moveWithCamera) {
                    this.cameraOffset = this.position.clone().add(this.scene.camera.camera.position);
                }

                this._createMesh();
                this.scene.add(this.mesh);
            }

            // ##############################################
            // # Private functions ##########################
            // ##############################################

            _createMesh() {
                let geometry = new THREE.Geometry();

                // Loop end condition has to accomodate for even/odd number of segments
                let condition = (this.segments % 2 == 0) ? this.width / 2 + 1 : this.width / 2;
                for(let x = -this.width / 2; x <= condition; x += this.width / this.segments) {
                    geometry.vertices.push(
                        new THREE.Vector3(x, 0, -this.height / 2),
                        new THREE.Vector3(x, 0,  this.height / 2)
                    );
                }
                
                condition = (this.segments % 2 == 0) ? this.height / 2 + 1 : this.height / 2;
                for(let z = -this.height / 2; z <= condition; z += this.height / this.segments) {
                    geometry.vertices.push(
                        new THREE.Vector3(-this.width / 2, 0, z),
                        new THREE.Vector3( this.width / 2, 0, z)
                    );
                }

                let material = new THREE.LineBasicMaterial({ color:0x333333 });
                
                this.mesh = new THREE.LineSegments(geometry, material);
                this.mesh.position.set(this.position.x, this.position.y, this.position.z);
            }

            // ##############################################
            // # Public functions ###########################
            // ##############################################

            update(deltaT) {
                super.update(deltaT);

                let camera = this.scene.camera.camera;

                if(this.moveWithCamera) {
                    let roundedOffset = new THREE.Vector3(
                        (camera.position.x - this.cameraOffset.x) % (this.width  / this.segments),
                        camera.position.y  - this.cameraOffset.y,
                        (camera.position.z - this.cameraOffset.z) % (this.height / this.segments)
                    );

                    let newPosition = camera.position
                        .clone()
                        .sub(this.cameraOffset)
                        .sub(roundedOffset);

                    this.position.set(
                        newPosition.x,
                        newPosition.y,
                        newPosition.z
                    );

                    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
                }
            }

            // ##############################################

        } // class
    }
);