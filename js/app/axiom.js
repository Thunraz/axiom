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

        let renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(config.canvasWidth, config.canvasHeight);
        document.getElementById('game').appendChild( renderer.domElement );
        
        let camera = new THREE.PerspectiveCamera(config.camera.fov, config.canvasWidth / config.canvasHeight, 0.1, 1000);
        camera.rotation.x = 0.75;
        camera.position.y = -40;
        camera.position.z = 50;

        let ambientLight = new THREE.AmbientLight( 0x101010 ); // soft white light
        scene.add( ambientLight );

        // Create plane that is being displayed at origin and moves with the camera
        //let cameraPlaneGeometry = new THREE.PlaneGeometry(20, 20, 10, 10);
        let cameraPlane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20, 10, 10));
        let cameraPlaneOffset = new THREE.Vector3().add(camera.position);
        cameraPlane.material = new THREE.MeshBasicMaterial({ color:0xaaaaaa, wireframe: true});
        scene.add(cameraPlane);

        GameObjectManager.add(new Planet(scene, 'home',   1234.0,   100.0, new THREE.Vector3(-10.0, 5.0, 0.0), true, 0x33ff33));
        GameObjectManager.add(new Planet(scene, 'second', 6000.0,   50.0,  new THREE.Vector3(7.0, 3.0, 0.0),   true, 0xff3333));
        GameObjectManager.add(new Star(scene,   'sol',    400000.0, 300.0, new THREE.Vector3(0.0, 0.0, 0.0),         0xffff00));

        GameObjectManager.add(new SpaceShip(scene, 'player', 40.0, new THREE.Vector3(0.0, 5.0, 0.0)));

        GameObjectManager.get('home').velocity.setX(.01);
        GameObjectManager.get('home').velocity.setY(.02);

        GameObjectManager.get('second').velocity.setX(.01);
        GameObjectManager.get('second').velocity.setY(-.02);

        GameObjectManager.get('player').velocity.setX(-.03);

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

            // Update cameraPlane position
            cameraPlane.position.set(
                camera.position.x - cameraPlaneOffset.x,
                camera.position.y - cameraPlaneOffset.y,
                camera.position.z - cameraPlaneOffset.z
            );
            
            // Render the scene
            renderer.render(scene, camera);

            stats.end();
            requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }
);