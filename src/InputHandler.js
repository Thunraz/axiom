'use strict';
define(['config'], function(config) {

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
        /* → */ 39: 'cameraRight'
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
        // Shorthands
        let rotation      = cameraObject.camera.rotation;
        let position      = cameraObject.camera.position;
        let target        = cameraObject.controls.target;
        let movementSpeed = config.camera.movementSpeed;

        if(controls.cameraUp && !controls.cameraDown) {
            position.x -= Math.sin(rotation.z) * movementSpeed;
            target.x   -= Math.sin(rotation.z) * movementSpeed;

            position.z -= Math.cos(rotation.z) * movementSpeed;
            target.z   -= Math.cos(rotation.z) * movementSpeed;
        }
        
        if(controls.cameraDown && !controls.cameraUp) {
            position.x += Math.sin(rotation.z) * movementSpeed;
            target.x   += Math.sin(rotation.z) * movementSpeed;

            position.z += Math.cos(rotation.z) * movementSpeed;
            target.z   += Math.cos(rotation.z) * movementSpeed;
        }

        if(controls.cameraLeft && !controls.cameraRight) {
            position.x -=  Math.cos(rotation.z) * movementSpeed;
            target.x   -=  Math.cos(rotation.z) * movementSpeed;

            position.z -= -Math.sin(rotation.z) * movementSpeed;
            target.z   -= -Math.sin(rotation.z) * movementSpeed;
        }
        
        if(controls.cameraRight && !controls.cameraLeft) {
            position.x +=  Math.cos(rotation.z) * movementSpeed;
            target.x   +=  Math.cos(rotation.z) * movementSpeed;

            position.z += -Math.sin(rotation.z) * movementSpeed;
            target.z   += -Math.sin(rotation.z) * movementSpeed;
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