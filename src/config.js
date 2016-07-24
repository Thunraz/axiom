'use strict';
define({
    canvasWidth:  window.innerWidth,
    canvasHeight: window.innerHeight,

    camera: {
        movementSpeed: 1.0,
        zoomFactor:    0.05,
        rotationSpeed: 0.05,

        fov:           45
    },

    showDirectionalVectors: false,
    
    framesToSmoothDeltaT: 128,

    maxAnisotropy:        0
});