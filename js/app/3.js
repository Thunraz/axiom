define(['app/config', 'three', 'app/controls', 'app/inputHandler'],function(config, THREE, controls, inputHandler) {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(config.camera.fov, config.canvasWidth/config.canvasHeight, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(config.canvasWidth, config.canvasHeight);
    document.getElementById('game').appendChild( renderer.domElement );

    var geometry = new THREE.SphereGeometry(1.5, 32, 32);
    var material = new THREE.MeshPhongMaterial({color: 0x33ff33});
    var cube = new THREE.Mesh(geometry, material);

    scene.add(cube);

    var ambientLight = new THREE.AmbientLight( 0x101010 ); // soft white light
    scene.add( ambientLight );

    var pointLight = new THREE.PointLight( 0x111111, 4 * Math.PI, 100 );
    pointLight.position.set( 1, 1, 2 );
    scene.add( pointLight );

    camera.position.z = 50;

    function update() {
        requestAnimationFrame(update);

        inputHandler.checkInput();

        cube.rotation.x += 0.1;
        cube.rotation.y += 0.1;
        renderer.render(scene, camera);

        inputHandler.checkInput(camera);
    }

    update();
});