'use strict';
define(['app/config'], function(config) {

    // ##############################################
    // # Add event listeners ########################
    // ##############################################

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    document.getElementById('ShowDirectionalVectors').addEventListener('change', showDirectionalVectors, false);

    // ##############################################
    // # Private functions ##########################
    // ##############################################

    let controls = {
        up: false,
        right: false,
        down: false,
        left: false,

        rotateLeft: false,
        rotateRight: false,

        zoomIn: false,
        zoomOut: false
    };

    let mapping = {
        /* W */ 87: 'up',
        /* A */ 65: 'left',
        /* S */ 83: 'down',
        /* D */ 68: 'right',
         
        /* ↑ */ 38: 'up',
        /* ← */ 40: 'down',
        /* ↓ */ 37: 'left',
        /* → */ 39: 'right',

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

    function cameraMovement(cameraObject) {
        let camera = cameraObject.camera;
        let pivot  = cameraObject.pivot;

        if(controls.up && !controls.down) {
            pivot.position.x += -Math.sin(pivot.rotation.z) * 1 / camera.zoom * config.camera.movementSpeed;
            pivot.position.y += Math.cos(pivot.rotation.z)  * 1 / camera.zoom * config.camera.movementSpeed;
        }
        
        if(controls.down && !controls.up) {
            pivot.position.x -= -Math.sin(pivot.rotation.z) * 1 / camera.zoom * config.camera.movementSpeed;
            pivot.position.y -= Math.cos(pivot.rotation.z)  * 1 / camera.zoom * config.camera.movementSpeed;
        }

        if(controls.left && !controls.right) {
            pivot.position.x -= Math.cos(pivot.rotation.z) * 1 / camera.zoom * config.camera.movementSpeed;
            pivot.position.y -= Math.sin(pivot.rotation.z)  * 1 / camera.zoom * config.camera.movementSpeed;
        }
        
        if(controls.right && !controls.left) {
            pivot.position.x += Math.cos(pivot.rotation.z) * 1 / camera.zoom * config.camera.movementSpeed;
            pivot.position.y += Math.sin(pivot.rotation.z)  * 1 / camera.zoom * config.camera.movementSpeed;
        }

        if(controls.zoomIn && !controls.zoomOut) {
            camera.zoom *= 1 + config.camera.zoomFactor;
            camera.updateProjectionMatrix();
        }

        if(controls.zoomOut && !controls.zoomIn) {
            camera.zoom *= 1 - config.camera.zoomFactor;
            camera.updateProjectionMatrix();
        }

        if(controls.rotateLeft && !controls.rotateRight) {
            pivot.rotation.z += config.camera.rotationSpeed;
        }

        if(controls.rotateRight && !controls.rotateLeft) {
            pivot.rotation.z -= config.camera.rotationSpeed;
        }
    }

    // ##############################################
    // # Public functions ###########################
    // ##############################################

    function checkInput(camera) {
        if(camera != undefined) cameraMovement(camera);
    }

    // ##############################################

    return {
        checkInput: checkInput
    };
});