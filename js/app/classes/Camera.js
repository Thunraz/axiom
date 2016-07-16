'use strict';
define(
    ['three', 'OrbitControls'],
    function(THREE) {
        return class Camera {
            
            // ##############################################
            // # Constructor ################################
            // ##############################################

            constructor(scene, renderer, fov, aspectRatio, near, far, cameraPosition, targetPosition) {
                this.scene = scene;

                this.near           = near;
                this.far            = far;
                this.cameraPosition = cameraPosition;
                this.targetPosition = targetPosition;

                this.camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
                this.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
                this.camera.zoom = 0.5;
                //this.camera.rotation.z = Math.PI / 4;
                this.camera.updateProjectionMatrix();

                scene.camera = this;

                this.controls = new THREE.OrbitControls(this.camera, renderer.domElement);
                this.controls.enableDamping = true;
                this.controls.dampingFactor = 0.125;
                this.controls.enableZoom    = true;
            }
        }
    }
);