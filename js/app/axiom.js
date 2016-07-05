'use strict';
define(
    [
        'app/config',
        'three',
        'stats',
        'app/controls',
        'app/inputHandler',
        'app/classes/GameObjectManager',
        'app/classes/Planet',
        'app/classes/Star',
        'app/classes/SpaceShip'
    ],
    function(config, THREE, Stats, controls, inputHandler, GameObjectManager, Planet, Star, SpaceShip) {
        let stats = new Stats();
        stats.showPanel(0);
        document.body.appendChild(stats.dom);

        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(config.camera.fov, config.canvasWidth/config.canvasHeight, 0.1, 1000);

        let renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(config.canvasWidth, config.canvasHeight);
        document.getElementById('game').appendChild( renderer.domElement );

        let ambientLight = new THREE.AmbientLight( 0x101010 ); // soft white light
        scene.add( ambientLight );

        camera.position.z = 50;

        GameObjectManager.add(new Planet(scene, 'home',  1234.0, 100.0, new THREE.Vector3(-10.0, 5.0, 0.0), true, 0x33ff33));
        GameObjectManager.add(new Planet(scene, 'second', 6000.0,  50.0, new THREE.Vector3(7.0, 3.0, 0.0),   true, 0xff3333));
        GameObjectManager.add(new Star(scene, 'sol', 400000.0, 300.0, new THREE.Vector3(0.0, 0.0, 0.0), 0xffff00));

        GameObjectManager.add(new SpaceShip(scene, 'player', 40.0, new THREE.Vector3(0.0, 0.0, 0.0)));

        GameObjectManager.get(0).velocity.setX(.01);
        GameObjectManager.get(0).velocity.setY(.02);

        GameObjectManager.get(1).velocity.setX(.01);
        GameObjectManager.get(1).velocity.setY(-.02);

        let lastFrameTime = 0;

        function update(currentFrameTime) {
            stats.begin();

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
            renderer.render(scene, camera);

            stats.end();
            requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }
);