'use strict';
define(
    [
        'app/config',
        'three',
        'app/controls',
        'app/inputHandler',
        'app/classes/Planet'
    ],
    function(config, THREE, controls, inputHandler, Planet) {
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(config.camera.fov, config.canvasWidth/config.canvasHeight, 0.1, 1000);

        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(config.canvasWidth, config.canvasHeight);
        document.getElementById('game').appendChild( renderer.domElement );

        var ambientLight = new THREE.AmbientLight( 0x101010 ); // soft white light
        scene.add( ambientLight );

        var pointLight = new THREE.PointLight( 0x111111, 4 * Math.PI, 100 );
        pointLight.position.set( 1, 1, 2 );
        scene.add( pointLight );

        camera.position.z = 50;
        
        var homePlanet = new Planet('home', 1234.0, 100.0, new THREE.Vector3(0.0, 0.0, 0.0), true, 0x33ff33);
        scene.add(homePlanet.mesh);

        function update() {
            requestAnimationFrame(update);

            inputHandler.checkInput();

            renderer.render(scene, camera);

            inputHandler.checkInput(camera);
        }

        update();
    }
);