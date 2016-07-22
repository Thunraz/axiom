'use strict';
define(
    [
        'config',
        'three',
        'stats',
        'InputHandler',
        'Debug',
        'Camera',
        'GameObjectManager',
        'Grid',
        'Planet',
        'Star',
        'SpaceShip',
        'Player'
    ],
    function(config, THREE, Stats, InputHandler, Debug, Camera, GameObjectManager, Grid, Planet, Star, SpaceShip, Player) {
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
            new THREE.Vector3(25, 75, 75)
        );

        // Create cube map
        let baseUrl = '/assets/textures/cubemap_';
        let urls = [
            baseUrl + 'left.png',
            baseUrl + 'right.png',
            baseUrl + 'top.png',
            baseUrl + 'bottom.png',
            baseUrl + 'front.png',
            baseUrl + 'back.png',
        ];
        var cube = new THREE.CubeTextureLoader().load(urls);
        cube.format = THREE.RGBFormat;
        scene.background = cube;

        scene.add(new THREE.AmbientLight( 0x101010 ));

        // Add objects
        GameObjectManager.add([
            new Grid(scene, 'xz_grid', { moveWithCamera: true }),

            new Planet(scene, 'homePlanet', {
                mass:     1.2E7,
                radius:   150,
                position: new THREE.Vector3(75, 0, 0),
                isSolid:  true,
                color:    0x33ff33
            }),

            new Planet(scene, 'redPlanet', {
                mass:     33.18,
                radius:   50,
                position: new THREE.Vector3(0, 18, 0),
                isSolid:  true,
                color:    0xff3333
            }),
            
            new Star(scene, 'sol', {
                mass:     1.9984E8,
                radius:   1400,
                color:    0xffff00
            }),

            new Player(scene, 'player', {
                mass:     3.42E-19,
                position: new THREE.Vector3(0, 0, -50)
            })
        ]);

        // Give objects a speed so they won't
        // just plunge back into the sun
        GameObjectManager.get('redPlanet').velocity.setX(0.2);
        GameObjectManager.get('redPlanet').velocity.setZ(0.3);

        GameObjectManager.get('homePlanet').velocity.setY(0.03);
        GameObjectManager.get('homePlanet').velocity.setZ(0.2);

        GameObjectManager.get('player').velocity.setX(.2);
        GameObjectManager.get('player').velocity.setZ(0);

        // Define variables to calculate deltaT
        // and smoothed deltaT
        let lastFrameTime    = 0;
        let lastDeltaTValues = [];
        let smoothDeltaT     = 0;

        let inputHandler = new InputHandler(scene, camera, GameObjectManager.get('player'));

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
            inputHandler.checkInput();

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