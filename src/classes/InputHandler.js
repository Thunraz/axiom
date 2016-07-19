'use strict';
define(['config'], function(config) {

    // ##############################################
    // # Private functions ##########################
    // ##############################################

    let controls = {
        playerAccelerate: false,
        playerDecelerate: false,
        playerTurnLeft  : false,
        playerTurnRight : false,

        rotateLeft : false,
        rotateRight: false,

        zoomIn : false,
        zoomOut: false
    };

    let mapping = {
        /* W */ 87: 'playerAccelerate',
        /* S */ 83: 'playerDecelerate',
        /* A */ 65: 'playerTurnLeft',
        /* D */ 68: 'playerTurnRight',
         
        /* ↑ */ 38: 'cameraUp',
        /* ← */ 40: 'cameraDown',
        /* ↓ */ 37: 'cameraLeft',
        /* → */ 39: 'cameraRight',
        
        /* Q */ 81: null,
        /* E */ 69: null,

        /* R */ 82: null,
        /* F */ 70: null
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

    function _cameraMovement(cameraObject) {
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

    function _playerMovement(player) {
        if(controls.playerAccelerate && !controls.playerDecelerate) {
            player.accelerate();
        }

        if(controls.playerDecelerate && !controls.playerAccelerate) {
            player.decelerate();
        }

        if(controls.playerTurnLeft && !controls.playerTurnRight) {
            player.turnLeft();
        }

        if(controls.playerTurnRight && !controls.playerTurnLeft) {
            player.turnRight();           
        }
    }

    // ##############################################

    let inputHandlerClass = class {

        // ##############################################
        // # Constructor ################################
        // ##############################################

        constructor(scene, camera, player) {
            this.scene  = scene;
            this.camera = camera;
            this.player = player;
            
            // Add event listeners
            document.addEventListener('keydown', onKeyDown, false);
            document.addEventListener('keyup', onKeyUp, false);
            
            document.getElementById('ShowDirectionalVectors')
                .addEventListener('change', showDirectionalVectors, false);
        }
        

        // ##############################################
        // # Public functions ###########################
        // ##############################################

        checkInput() {
            if(this.camera) {
                _cameraMovement(this.camera);
            }

            if(this.player) {
                _playerMovement(this.player);
            }
        }
    }

    return inputHandlerClass;
});