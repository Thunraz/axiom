'use strict';
define(
    ['three', 'app/classes/SpaceObject'],
    function(THREE, SpaceObject) {
        return class Grid extends SpaceObject {

            // ##############################################
            // # Constructor ################################
            // ##############################################

            constructor(scene, name, position, width, height, segments, camera) {
                super();

                this.scene  = scene;
                if(camera) {
                    this.camera = camera;
                }

                this.name     = name;
                this.position = position;
                this.width    = width;
                this.height   = height;
                this.segments = segments;

                if(camera) {
                    this.cameraOffset   = this.position.clone().add(this.camera.position);
                }

                this._createMesh(segments);
                this.scene.add(this.mesh);
            }

            // ##############################################
            // # Private functions ##########################
            // ##############################################

            _createMesh(segments) {
                let geometry = new THREE.Geometry();

                for(let x = -this.width / 2; x <= this.width / 2; x += this.width / segments) {
                    geometry.vertices.push(
                        new THREE.Vector3(x, -this.height / 2, 0),
                        new THREE.Vector3(x,  this.height / 2, 0)
                    );
                }

                for(let y = -this.height / 2; y <= this.height / 2; y += this.height / segments) {
                    geometry.vertices.push(
                        new THREE.Vector3(-this.width / 2, y, 0),
                        new THREE.Vector3( this.width / 2, y, 0)
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

                if(this.camera) {
                    let roundedOffset = new THREE.Vector3(
                        (this.camera.position.x - this.cameraOffset.x) % (this.width  / this.segments),
                        (this.camera.position.y - this.cameraOffset.y) % (this.height / this.segments),
                        this.camera.position.z - this.cameraOffset.z
                    );

                    let newPosition = this.camera.position
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