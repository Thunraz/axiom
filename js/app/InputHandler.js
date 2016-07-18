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
         
        /* ↑ */ 38: 'cameraUp',
        /* ← */ 40: 'cameraDown',
        /* ↓ */ 37: 'cameraLeft',
        /* → */ 39: 'cameraRight',

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

        if(controls.cameraUp && !controls.cameraDown) {
            camera.position.x += -Math.sin(camera.rotation.z) * 1 / camera.zoom * config.camera.movementSpeed;
            camera.position.y += Math.cos(camera.rotation.z)  * 1 / camera.zoom * config.camera.movementSpeed;
        }
        
        if(controls.cameraDown && !controls.cameraUp) {
            camera.position.x -= -Math.sin(camera.rotation.z) * 1 / camera.zoom * config.camera.movementSpeed;
            camera.position.y -= Math.cos(camera.rotation.z)  * 1 / camera.zoom * config.camera.movementSpeed;
        }

        if(controls.cameraLeft && !controls.cameraRight) {
            camera.position.x -= Math.cos(camera.rotation.z) * 1 / camera.zoom * config.camera.movementSpeed;
            camera.position.y -= Math.sin(camera.rotation.z)  * 1 / camera.zoom * config.camera.movementSpeed;
        }
        
        if(controls.cameraRight && !controls.cameraLeft) {
            camera.position.x += Math.cos(camera.rotation.z) * 1 / camera.zoom * config.camera.movementSpeed;
            camera.position.y += Math.sin(camera.rotation.z)  * 1 / camera.zoom * config.camera.movementSpeed;
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