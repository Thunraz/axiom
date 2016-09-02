export let config = {
    canvasWidth:  window.innerWidth,
    canvasHeight: window.innerHeight,

    camera: {
        movementSpeed:      1.0,
        zoomFactor:         0.05,
        rotationSpeed:      0.05,

        fov:                60,
        near:               0.1,
        far:                1000,
        initialPosition:    { x: 25, y: 75, z: 75 }
    },

    showDirectionalVectors: false,
    
    framesToSmoothDeltaT: 128,

    maxAnisotropy:        0
};

export default config;