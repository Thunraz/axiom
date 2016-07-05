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
                controls.zoomIn = true;
                break;

            case 69: // E
                controls.zoomOut = true;
                break;
        }
    }

    // ##############################################

    function onKeyUp(event) {
        console.log(event.keyCode);

        /*
        * KeyCodes in use:
        * 38 Up, 40 Down, 37 Left, 39 Right
        * 87 W,  65 A,    83 S,    68 D,    81 Q, 69 E
        */

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
                controls.zoomIn = false;
                break;

            case 69: // E
                controls.zoomOut = false;
                break;
        }
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
            camera.zoom *= 1 - config.camera.zoomFactor;
            camera.updateProjectionMatrix();
        }

        if(controls.zoomOut && !controls.zoomIn) {
            camera.zoom *= 1 + config.camera.zoomFactor;
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