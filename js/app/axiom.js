'use strict';
define(
    [
        'app/config',
        'three',
        'stats',
        'app/InputHandler',
        'app/classes/Debug',
        'app/classes/Camera',
        'app/classes/GameObjectManager',
        'app/classes/Planet',
        'app/classes/Star',
        'app/classes/SpaceShip',
        'app/classes/Grid'
    ],
    function(config, THREE, Stats, InputHandler, Debug, Camera, GameObjectManager, Planet, Star, SpaceShip, Grid) {
        let stats = new Stats();
        stats.showPanel(0);
        document.body.appendChild(stats.dom);

        let renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(config.canvasWidth, config.canvasHeight);
        document.getElementById('game').appendChild(renderer.domElement);
        
        config.maxAnisotropy = renderer.getMaxAnisotropy();

        let scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x000000, 100, 300);

        // Create camera
        let camera = new Camera(
            scene,
            renderer,
            config.camera.fov,
            config.canvasWidth / config.canvasHeight,
            0.1,
            1000,
            new THREE.Vector3(25, 50, 50)
        );

        scene.add(new THREE.AmbientLight( 0x101010 ));

        // Add objects
        GameObjectManager.add([
            new Grid(scene, 'grid', new THREE.Vector3(0, 0, 0), 750, 750, 60, true),

            new Planet(scene, 'redPlanet',     3.301,   20, new THREE.Vector3( 0, 18, 0), true, 0xff3333),
            new Planet(scene, 'homePlanet',   48.690,  100, new THREE.Vector3(25, 0,  0), true, 0x33ff33),
            
            new Star(  scene, 'sol',        1.9984E8, 1400, new THREE.Vector3( 0,  0, 0),       0xffff00),

            new SpaceShip(scene, 'player', 40.0, new THREE.Vector3(0, 0, -50))
        ]);

        // Give objects a speed so they won't
        // just plunge back into the sun
        GameObjectManager.get('redPlanet').velocity.setX(0.2);
        GameObjectManager.get('redPlanet').velocity.setZ(0.3);

        GameObjectManager.get('homePlanet').velocity.setY(0.03);
        GameObjectManager.get('homePlanet').velocity.setZ(0.3);

        GameObjectManager.get('player').velocity.setX(.2);
        GameObjectManager.get('player').velocity.setZ(0);

        // Define variables to calculate deltaT
        // and smoothed deltaT
        let lastFrameTime    = 0;
        let lastDeltaTValues = [];
        let smoothDeltaT     = 0;

        function update(currentFrameTime) {
            stats.begin();
            Debug.clear();

            let deltaT = currentFrameTime - lastFrameTime;
            lastFrameTime = currentFrameTime;

            // Ugly hack to prevent "jumps" when the tab lost focus
            if(deltaT > 32) deltaT = 1000/60;

            // Smooth deltaT
            while(lastDeltaTValues.length >= config.framesToSmoothDeltaT) {
                lastDeltaTValues.splice(0, 1);
            }
            lastDeltaTValues.push(deltaT);
            smoothDeltaT = lastDeltaTValues.reduce(function(prev, cur) { return prev + cur;}) / lastDeltaTValues.length;

            // Update controls
            camera.controls.update();

            // Handle user input
            InputHandler.checkInput(camera);

            // Update all the objects' positions
            GameObjectManager.updatePositions(deltaT, smoothDeltaT);

            // Update all the objects
            GameObjectManager.update(deltaT, smoothDeltaT);
            
            // Render the scene
            renderer.render(scene, camera.camera);

            stats.end();
            requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }
);