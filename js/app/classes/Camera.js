'use strict';
define(
    ['three'],
    function(THREE) {
        return class Camera {
            
            // ##############################################
            // # Constructor ################################
            // ##############################################

            constructor(scene, fov, aspectRatio, near, far, cameraPosition, targetPosition) {
                this.scene = scene;

                this.fov            = fov;
                this.aspectRatio    = aspectRatio;
                this.near           = near;
                this.far            = far;
                this.cameraPosition = cameraPosition;
                this.targetPosition = targetPosition;

                this.pivot = new THREE.Object3D();
                this.pivot.position.set(targetPosition.x, targetPosition.y, targetPosition.z);

                /*this.camera = new THREE.PerspectiveCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight, near, far);
                this.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
                this.camera.zoom = 5;
                this.camera.lookAt(this.pivot.position);
                this.camera.updateProjectionMatrix();*/

                this.camera = new THREE.OrthographicCamera(-800, 800, 600, -600, -500, 1000);
                this.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
                this.camera.zoom = 7;
                this.camera.updateProjectionMatrix();
                this.camera.rotation.x = Math.PI / 4;

                this.pivot.rotation.z = Math.PI / 4;

                this.pivot.add(this.camera);
                scene.add(this.pivot);
                scene.camera = this;
            }
        }
    }
);