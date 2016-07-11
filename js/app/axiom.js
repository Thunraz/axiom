'use strict';
define(
    [
        'app/config',
        'three',
        'stats',
        'app/inputHandler',
        'app/classes/Debug',
        'app/classes/Camera',
        'app/classes/GameObjectManager',
        'app/classes/Planet',
        'app/classes/Star',
        'app/classes/SpaceShip',
        'app/classes/Grid'
    ],
    function(config, THREE, Stats, inputHandler, Debug, Camera, GameObjectManager, Planet, Star, SpaceShip, Grid) {
        let stats = new Stats();
        stats.showPanel(0);
        document.body.appendChild(stats.dom);

        let scene = new THREE.Scene();

        let renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(config.canvasWidth, config.canvasHeight);
        document.getElementById('game').appendChild( renderer.domElement );

        let camera = new Camera(
            scene,
            config.camera.fov,
            config.canvasWidth / config.canvasHeight,
            0.1,
            1000,
            new THREE.Vector3(0, -465, 500),
            new THREE.Vector3(0, 0, 0)
        );
        
        let ambientLight = new THREE.AmbientLight( 0x101010 ); // soft white light
        scene.add( ambientLight );

        // Create plane that is being displayed at origin and moves with the camera
        let cameraPlaneWidth  = 20;
        let cameraPlaneHeight = 20;

        GameObjectManager.add([
            new Grid(scene, 'grid', new THREE.Vector3(0, 0, 0), 75, 75, 6, true),

            new Planet(scene, 'redPlanet',    3.301,   21.036, new THREE.Vector3( 0, 18, 0), true, 0xff3333),
            new Planet(scene, 'homePlanet',    48.690, 100.48794, new THREE.Vector3(25,  0, 0), true, 0x33ff33),
            
            new Star(scene, 'sol', 1.9984E8, 1392.684, new THREE.Vector3(0, 0, 0), 0xffff00),

            new SpaceShip(scene, 'player', 40.0, new THREE.Vector3(0, 50, 0))
        ]);

        GameObjectManager.get('redPlanet').velocity.setX(0.2);
        GameObjectManager.get('redPlanet').velocity.setZ(0.3);

        GameObjectManager.get('homePlanet').velocity.setZ(0.03);
        GameObjectManager.get('homePlanet').velocity.setY(-0.3);

        GameObjectManager.get('player').velocity.setX(.2);
        GameObjectManager.get('player').velocity.setY(0);

        let lastFrameTime = 0;

        function update(currentFrameTime) {
            stats.begin();

            Debug.clear();

            let deltaT = currentFrameTime - lastFrameTime;
            lastFrameTime = currentFrameTime;

            // Ugly hack to prevent "jumps" when the tab lost focus 
            if(deltaT > 32) deltaT = 1000/60;

            // Handle user input            
            inputHandler.checkInput(camera);

            // Update all the objects' positions
            GameObjectManager.updatePositions(deltaT);

            // Update all the objects
            GameObjectManager.update(deltaT);
            
            // Render the scene
            renderer.render(scene, camera.camera);

            stats.end();
            requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }
);