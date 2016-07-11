'use strict';
define(['app/controls', 'app/config'], function(controls, config) {

    // ##############################################
    // # Add event listeners ########################
    // ##############################################

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    document.getElementById('ShowDirectionalVectors').addEventListener('change', showDirectionalVectors, false);

    // ##############################################
    // # Private functions ##########################
    // ##############################################

    let mapping = {
        /* W */ 87: 'up',
        /* A */ 83: 'down',
        /* S */ 65: 'left',
        /* D */ 68: 'right',

        /* Q */ 81: 'rotateLeft',
        /* E */ 69: 'rotateRight',

        /* R */ 82: 'zoomIn',
        /* F */ 70: 'zoomOut'
    };

    function onKeyDown(event) {
        if(!mapping[event.keyCode]) return;
        controls[mapping[event.keyCode]] = true;
    }

    // ##############################################

    function onKeyUp(event) {
        if(!mapping[event.keyCode]) return;
        controls[mapping[event.keyCode]] = false;
    }

    // ##############################################

    function showDirectionalVectors(event) {
        config.showDirectionalVectors = event.target.checked;
    }

    // ##############################################

    function cameraMovement(camera) {
        if(controls.up && !controls.down) {
            camera.position.y += 1 / camera.zoom * config.camera.movementSpeed;
        }
        
        if(controls.down && !controls.up) {
            camera.position.y -= 1 / camera.zoom * config.camera.movementSpeed;
        }

        if(controls.left && !controls.right) {
            camera.position.x -= 1 / camera.zoom * config.camera.movementSpeed;
        }
        
        if(controls.right && !controls.left) {
            camera.position.x += 1 / camera.zoom * config.camera.movementSpeed;
        }

        if(controls.zoomIn && !controls.zoomOut) {
            camera.zoom *= 1 + config.camera.zoomFactor;
            camera.updateProjectionMatrix();
        }

        if(controls.zoomOut && !controls.zoomIn) {
            camera.zoom *= 1 - config.camera.zoomFactor;
            camera.updateProjectionMatrix();
        }
    }

    // ##############################################
    // # Public functions ###########################
    // ##############################################

    var single = true;

    function checkInput(camera) {
        if(camera != undefined) cameraMovement(camera);
    }

    // ##############################################

    return {
        checkInput: checkInput
    };
});