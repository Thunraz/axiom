'use strict';
define(
    ['config', 'three'],
    function(config, THREE) {
        return class Hud {
            
            // ##############################################
            // # Constructor ################################
            // ##############################################

            constructor() {
                let canvas    = document.createElement('canvas');
                canvas.width  = config.canvasWidth;
                canvas.height = config.canvasHeight;

                let bitmap       = canvas.getContext('2d');
                bitmap.font      = 'Normal 40px Changa';
                bitmap.textAlign = 'center';
                bitmap.fillStyle = 'rgba(245, 245, 245, 0.75)';
                bitmap.fillText('Initializing...', config.canvasWidth / 2, config.canvasHeight / 2);

                this.camera = new THREE.OrthographicCamera(
                    -config.canvasWidth / 2, config.canvasWidth / 2,
                    config.canvasHeight / 2, -config.canvasHeight / 2,
                    0, 300
                );

                this.scene = new THREE.Scene();
                this.texture = new THREE.Texture(canvas)
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
            }
        }
    }
);