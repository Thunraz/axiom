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
        'Grid'
    ],
    function(config, THREE, Stats, InputHandler, Debug, Camera, GameObjectManager, Grid) {
        let stats = new Stats();
        stats.showPanel(0);
        document.body.appendChild(stats.dom);

        let renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(config.canvasWidth, config.canvasHeight);
        document.getElementById('game').appendChild(renderer.domElement);
        
        window.addEventListener('resize', onWindowResize, false);
        
        config.maxAnisotropy = renderer.getMaxAnisotropy();

        let scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x000000, 100, 1000);

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
        let baseUrl = 'assets/textures/';
        let format = '.png';
        let urls = [
            baseUrl + 'px' + format, baseUrl + 'nx' + format,
            baseUrl + 'py' + format, baseUrl + 'ny' + format,
            baseUrl + 'pz' + format, baseUrl + 'nz' + format
        ];
        var cube = new THREE.CubeTextureLoader().load(urls);
        cube.format = THREE.RGBFormat;
        scene.background = cube;

        scene.add(new THREE.AmbientLight( 0x101010 ));

        GameObjectManager.add(new Grid(scene, 'xz_grid', { moveWithCamera: true }));
        GameObjectManager.load('assets/data/galaxy.json', scene, beginGame);

        // Define variables to calculate deltaT
        // and smoothed deltaT
        let lastFrameTime    = 0;
        let lastDeltaTValues = [];
        let smoothDeltaT     = 0;
        let inputHandler     = null;

        // #############################################################################################################

        function beginGame() {
            requestAnimationFrame(update);
            inputHandler = new InputHandler(scene, camera, GameObjectManager.get('player'));
        }

        // #############################################################################################################

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

        // #############################################################################################################

        function onWindowResize() {
            camera.camera.aspect = window.innerWidth / window.innerHeight;
            camera.camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        // #############################################################################################################
    }
);
