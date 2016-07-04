'use strict';
define(
    [
        'app/config',
        'three',
        'app/controls',
        'app/inputHandler',
        'app/classes/Planet',
        'app/classes/Star'
    ],
    function(config, THREE, controls, inputHandler, Planet, Star) {
        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(config.camera.fov, config.canvasWidth/config.canvasHeight, 0.1, 1000);

        let renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(config.canvasWidth, config.canvasHeight);
        document.getElementById('game').appendChild( renderer.domElement );

        let ambientLight = new THREE.AmbientLight( 0x101010 ); // soft white light
        scene.add( ambientLight );

        camera.position.z = 50;

        let astroObjects = [
            new Planet(scene, 'home',  1234.0, 100.0, new THREE.Vector3(-10.0, 5.0, 0.0), true, 0x33ff33),
            new Planet(scene, 'second', 80034.0,  50.0, new THREE.Vector3(7.0, 3.0, 0.0),   true, 0xff3333),

            new Star(scene, 'sol', 400000.0, 300.0, new THREE.Vector3(0.0, 0.0, 0.0), 0xffff00)
        ];

        astroObjects[0].velocity.setX(.01);
        astroObjects[0].velocity.setY(.02);

        astroObjects[1].velocity.setX(.01);
        astroObjects[1].velocity.setY(.02);

        let lastFrameTime = 0;

        function update(currentFrameTime) {
            let deltaT = currentFrameTime - lastFrameTime;
            lastFrameTime = currentFrameTime;

            // Ugly hack to prevent "jumps" when the tab lost focus 
            if(deltaT > 32) deltaT = 1000/60;

            // Handle user input            
            inputHandler.checkInput(camera);

            // Update all the objects' positions
            astroObjects.forEach(function(astroObject, index) {
                astroObject.updatePosition(deltaT, astroObjects);
            });

            // Update all the objects
            astroObjects.forEach(function(astroObject, index) {
                astroObject.update(deltaT, astroObjects);
            });
            
            // Render the scene
            renderer.render(scene, camera);

            requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }
);