import * as THREE from 'three';

import Camera            from './classes/Camera';
import Debug             from './classes/Debug';
import GameObjectManager from './classes/GameObjectManager';
import Grid              from './classes/Grid';
import Hud               from './classes/Hud';
import InputHandler      from './classes/InputHandler';
import Stats             from './lib/stats';

import config from './config';

// ################################################################################################

let stats;
let camera;
let hud;
let renderer;
let scene;

// Declare variables to calculate deltaT
// and smoothed deltaT
let   lastFrameTime    = 0;
const lastDeltaTValues = [];
let   smoothDeltaT     = 0;
let   inputHandler     = null;

// ################################################################################################

function createCubeMap() {
    // Create cube map
    const baseUrl = 'assets/textures/';
    const format = '.png';
    const urls = [
        `${baseUrl}px${format}`, `${baseUrl}nx${format}`,
        `${baseUrl}py${format}`, `${baseUrl}ny${format}`,
        `${baseUrl}pz${format}`, `${baseUrl}nz${format}`,
    ];

    const cube = new THREE.CubeTextureLoader().load(urls);
    cube.format = THREE.RGBFormat;

    return cube;
}

// ################################################################################################

function update(currentFrameTime) {
    stats.begin();
    Debug.clear();

    let deltaT = currentFrameTime - lastFrameTime;
    lastFrameTime = currentFrameTime;

    // Ugly hack to prevent "jumps" when the tab lost focus
    if (deltaT > 32) deltaT = 1000 / 60;

    // Smooth deltaT
    while (lastDeltaTValues.length >= config.framesToSmoothDeltaT) {
        lastDeltaTValues.splice(0, 1);
    }
    lastDeltaTValues.push(deltaT);
    smoothDeltaT = lastDeltaTValues.reduce((prev, cur) => prev + cur) / lastDeltaTValues.length;

    // Update controls
    camera.controls.update();

    // Handle user input
    inputHandler.checkInput();

    // Update all the objects' positions
    GameObjectManager.updatePositions(deltaT, smoothDeltaT);

    // Update all the objects
    GameObjectManager.update(deltaT, smoothDeltaT);

    // Update HUD
    hud.update();
    
    // Render the scene
    renderer.render(scene, camera.camera);

    // Render HUD
    // renderer.render(hud.scene, hud.camera);

    stats.end();
    requestAnimationFrame(update);
}

// ################################################################################################

function beginGame() {
    requestAnimationFrame(update);
    inputHandler = new InputHandler(scene, camera, GameObjectManager.get('player'));
}

// ################################################################################################

function onWindowResize() {
    camera.camera.aspect = window.innerWidth / window.innerHeight;
    camera.camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ################################################################################################

function init() {
    // Initialize stats
    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    // Create & initialize renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(config.canvasWidth, config.canvasHeight);
    document.getElementById('game').appendChild(renderer.domElement);
    config.maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    window.addEventListener('resize', onWindowResize, false);

    // Create scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 100, 1000);

    // Create HUD
    hud = new Hud();

    // Create camera
    camera = new Camera(
        scene,
        renderer,
        config.camera.fov,
        config.canvasWidth / config.canvasHeight,
        config.camera.near,
        config.camera.far,
        new THREE.Vector3(
            config.camera.initialPosition.x,
            config.camera.initialPosition.y,
            config.camera.initialPosition.z,
        ),
    );

    scene.background = createCubeMap();
    scene.add(new THREE.AmbientLight(0x101010));

    GameObjectManager.add(new Grid(scene, 'xz_grid', { moveWithCamera: true }));
    GameObjectManager.load('assets/data/galaxy.json', scene, beginGame);
}

init();
