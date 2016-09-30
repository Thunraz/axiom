import * as THREE from 'three';

import config from '../config';

export class Hud {
            
    // ##############################################
    // # Constructor ################################
    // ##############################################

    constructor() {
        this.canvas    = document.createElement('canvas');
        this.canvas.width  = 1024;
        this.canvas.height = 1024;

        this.bitmap      = this.canvas.getContext('2d');
        this.bitmap.font      = 'Normal 40px Changa';
        this.bitmap.textAlign = 'center';
        this.bitmap.fillStyle = 'rgba(245, 245, 245, 0.7)';
        this.bitmap.fillText('Initializing...', config.canvasWidth / 2, config.canvasHeight / 2);

        this.camera = new THREE.OrthographicCamera(
            -config.canvasWidth / 2, config.canvasWidth / 2,
            config.canvasHeight / 2, -config.canvasHeight / 2,
            0, 300
        );

        this.scene   = new THREE.Scene();
        this.texture = new THREE.Texture(this.canvas)
        this.texture.needsUpdate = true;
        let material = new THREE.MeshBasicMaterial({map: this.texture });
        material.transparent = true;

        let planeGeometry = new THREE.PlaneGeometry(config.canvasWidth, config.canvasHeight);
        let plane         = new THREE.Mesh(planeGeometry, material);
        this.scene.add(plane);
    }

    // ##############################################
    // # Public functions ###########################
    // ##############################################

    update() {
        this.bitmap.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
        this.bitmap.fillText('RAD]', config.canvasWidth / 2, config.canvasHeight / 2);
        this.texture.needsUpdate = true;
    }
}

export default Hud;