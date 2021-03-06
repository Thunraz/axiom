import * as THREE from 'three';

class Camera {
    // ##############################################
    // # Constructor ################################
    // ##############################################

    constructor(scene, renderer, fov, aspectRatio, near, far, cameraPosition) {
        this.scene = scene;

        this.near           = near;
        this.far            = far;
        this.cameraPosition = cameraPosition;

        this.camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
        this.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
        this.camera.zoom = 0.5;
        this.camera.updateProjectionMatrix();

        this.scene.camera = this;

        this.controls = new THREE.OrbitControls(this.camera, renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.125;
        this.controls.enableZoom    = true;
        this.controls.rotateSpeed   = 0.15;
        this.controls.enableKeys    = false;
        this.controls.mouseButtons  = { ORBIT: THREE.MOUSE.RIGHT, PAN: THREE.MOUSE.LEFT };
    }
}

export default Camera;
