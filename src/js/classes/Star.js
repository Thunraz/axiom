import * as THREE from 'three';

import AstronomicalObject     from './AstronomicalObject';
import AstronomicalObjectType from '../enums/AstronomicalObjectType';
import Noise                  from './Graphics/Noise';
import NoiseType              from '../enums/NoiseType';

import config from '../config';

export class Star extends AstronomicalObject {

    // ##############################################
    // # Constructor ################################
    // ##############################################

    constructor(scene, name, options) {
        super();
        
        if(!scene || !name || !options) {
            throw new Error('Star has not been initialized properly.');
        }

        this.scene    = scene;

        this.name     = name;
        this.mass     = options.mass     || 1E8;
        this.radius   = options.radius   || 1000;
        this.position = options.position || new THREE.Vector3();
        this.color    = options.color    || Math.round(Math.random() * 0xffffff / 2 + 0xffffff / 2);
        
        this.astronomicalObjectType = AstronomicalObjectType.STAR;

        this._createLight();
        this._createMesh();

        if(config.showDirectionalVectors) {
            this.arrowMesh = this._createDirectionalArrow();
            this.scene.add(this.arrowMesh);
        }
    }

    // ##############################################
    // # Private functions ##########################
    // ##############################################

    _createLight() {
        this.light = new THREE.PointLight( 0x111111, 4 * Math.PI, 100 );
        this.light.position.set(this.position.x, this.position.y, this.position.z);
        this.scene.add(this.light);
    }

    // ##############################################
    
    _createMesh() {
        let perlinNoise = new Noise(256, 256, 6, NoiseType.Perlin2D);

        let geometry = new THREE.SphereGeometry(this.radius / 100, 32, 32);
        let material = new THREE.MeshPhongMaterial({
            emissive: this.color,
            emissiveMap: perlinNoise.Texture,
            //map: perlinNoise.NoiseTexture(256, 256)
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.scene.add(this.mesh);
    }

    // ##############################################
    // # Public functions ###########################
    // ##############################################

    update(deltaT, smoothDeltaT, spaceObjects) {
        super.update(deltaT, smoothDeltaT, spaceObjects);
        
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.light.position.set(this.position.x, this.position.y, this.position.z);

        if(config.showDirectionalVectors && this.arrowMesh == null) {
            this.arrowMesh = this._createDirectionalArrow();
            this.scene.add(this.arrowMesh);
        }

        if(this.arrowMesh != null) {
            this.arrowMesh.visible = config.showDirectionalVectors;
        }
    }

    // ##############################################

} // class

export default Star;