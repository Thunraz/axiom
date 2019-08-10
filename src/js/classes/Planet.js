import * as THREE from 'three';

import AstronomicalObject     from './AstronomicalObject';
import AstronomicalObjectType from '../enums/AstronomicalObjectType';
import TrailParticle          from './TrailParticle';

import config from '../config';

class Planet extends AstronomicalObject {
    // ##############################################
    // # Constructor ################################
    // ##############################################
    
    constructor(scene, name, options) {
        super();

        if (!scene || !name || !options) {
            throw new Error('Planet has not been initialized properly.');
        }

        this.scene        = scene;

        this.name         = name;
        this.mass         = options.mass     || 50;
        this.radius       = options.radius   || 100;
        this.position     = options.position || new THREE.Vector3();
        this.color        = options.color    || Math.round(
            (Math.random() * 0xffffff) / 2 + 0xffffff / 2,
        );

        this.trail = [];

        this.frameCounter = 0;
        
        this.createMesh();
        this.radius = this.createYPosition(this.scene, this.radius);
        
        if (options.isSolid) {
            this.astronomicalObjectType = AstronomicalObjectType.SOLID;
        } else {
            this.astronomicalObjectType = AstronomicalObjectType.GAS;
        }

        if (config.showDirectionalVectors) {
            this.arrowMesh = this.createDirectionalArrow();
            this.scene.add(this.arrowMesh);
        }
    }

    // ##############################################
    // # Private functions ##########################
    // ##############################################
    
    createMesh() {
        const geometry = new THREE.SphereGeometry(this.radius / 100, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: this.color });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        
        this.mesh.name = this.name;
        this.scene.add(this.mesh);
    }

    // ##############################################
    // # Public functions ###########################
    // ##############################################

    update(deltaT, smoothDeltaT, spaceObjects) {
        super.update(deltaT, smoothDeltaT, spaceObjects);

        this.frameCounter += 1;

        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.updateYPosition();

        if (this.frameCounter % 10 === 0) {
            if (!this.oldTrailPosition) this.oldTrailPosition = this.position.clone();
            if (this.trail.length < 100) {
                this.trail.push(new TrailParticle(
                    this.scene,
                    this,
                    this.position,
                    this.oldTrailPosition,
                    10,
                ));
                this.oldTrailPosition = this.position.clone();
            }
        }

        for (let i = 0; i < this.trail.length; i++) {
            this.trail[i].update(deltaT);
        }

        this.trail = this.trail.filter((value) => value.alive);

        if (config.showDirectionalVectors && this.arrowMesh == null) {
            this.arrowMesh = this.createDirectionalArrow();
            this.scene.add(this.arrowMesh);
        }

        if (this.arrowMesh != null) {
            this.arrowMesh.visible = config.showDirectionalVectors;
        }
    }
} // class

export default Planet;
