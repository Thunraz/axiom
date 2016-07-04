'use strict';
define(['app/controls', 'app/config'], function(controls, config) {

    // ##############################################
    // # Add event listeners ########################
    // ##############################################

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    // ##############################################
    // # Private functions ##########################
    // ##############################################

    function onKeyDown(event) {
        switch(event.keyCode) {
            case 87: // W
                controls.up = true;
                break;

            case 65: // A
                controls.left = true;
                break;

            case 83: // S
                controls.down = true;
                break;

            case 68: // D
                controls.right = true;
                break;

            case 81: // Q
                controls.cameraUp = true;
                break;

            case 69: // E
                controls.cameraDown = true;
                break;
        }
    }

    // ##############################################

    function onKeyUp(event) {
        switch(event.keyCode) {
            case 87: // W
                controls.up = false;
                break;

            case 65: // A
                controls.left = false;
                break;

            case 83: // S
                controls.down = false;
                break;

            case 68: // D
                controls.right = false;
                break;

            case 81: // Q
                controls.cameraUp = false;
                break;

            case 69: // E
                controls.cameraDown = false;
                break;
        }
    }

    // ##############################################

    function cameraMovement(camera) {
        if(controls.up && !controls.down) {
            camera.position.y += config.camera.movementSpeed;
        }
        
        if(controls.down && !controls.up) {
            camera.position.y -= config.camera.movementSpeed;
        }

        if(controls.left && !controls.right) {
            camera.position.x -= config.camera.movementSpeed;
        }
        
        if(controls.right && !controls.left) {
            camera.position.x += config.camera.movementSpeed;
        }

        if(controls.cameraUp && !controls.cameraDown) {
            camera.position.z += config.camera.movementSpeed;
        }

        if(controls.cameraDown && !controls.cameraUp) {
            camera.position.z -= config.camera.movementSpeed;
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