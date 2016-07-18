'use strict';
define(
    ['three', 'app/classes/SpaceObject'],
    function(THREE, SpaceObject) {
        return class Grid extends SpaceObject {

            // ##############################################
            // # Constructor ################################
            // ##############################################

            constructor(scene, name, position, width, height, segments, moveWithCamera) {
                super();

                this.scene  = scene;
                
                this.name           = name;
                this.position       = position;
                this.width          = width;
                this.height         = height;
                this.segments       = segments;
                this.moveWithCamera = moveWithCamera || false;

                if(moveWithCamera) {
                    this.cameraOffset = this.position.clone().add(this.scene.camera.camera.position);
                }

                this._createMesh(segments);
                this.scene.add(this.mesh);
            }

            // ##############################################
            // # Private functions ##########################
            // ##############################################

            _createMesh(segments) {
                let geometry = new THREE.Geometry();

                let condition = (segments % 2 == 0) ? this.width / 2 + 1 : this.width / 2;
                for(let x = -this.width / 2; x <= condition; x += this.width / segments) {
                    geometry.vertices.push(
                        new THREE.Vector3(x, 0, -this.height / 2),
                        new THREE.Vector3(x, 0,  this.height / 2)
                    );
                }
                
                condition = (segments % 2 == 0) ? this.height / 2 + 1 : this.height / 2;
                for(let z = -this.height / 2; z <= condition; z += this.height / segments) {
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