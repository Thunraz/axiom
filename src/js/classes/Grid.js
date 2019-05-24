import * as THREE from 'three';

import SpaceObject from './SpaceObject';

class Grid extends SpaceObject {
    // ##############################################
    // # Constructor ################################
    // ##############################################

    constructor(scene, name, options) {
        super();

        this.scene = scene;
        this.name  = name;

        this.position       = options.position       || new THREE.Vector3();
        this.width          = options.width          || 7500;
        this.height         = options.height         || 7500;
        this.segments       = options.segments       || 600;
        this.moveWithCamera = options.moveWithCamera || false;
        this.opacity        = options.opacity        || 0.1;
        this.color          = options.color          || 0xffffff;

        if (this.moveWithCamera) {
            this.cameraOffset = this.position.clone().add(this.scene.camera.camera.position);
        }

        this.createMesh();
        this.scene.add(this.mesh);
    }

    // ##############################################
    // # Private functions ##########################
    // ##############################################

    createMesh() {
        const geometry = new THREE.Geometry();

        // Loop end condition has to accomodate for even/odd number of segments
        let condition = (this.segments % 2 === 0) ? this.width / 2 + 1 : this.width / 2;
        for (let x = -this.width / 2; x <= condition; x += this.width / this.segments) {
            geometry.vertices.push(
                new THREE.Vector3(x, 0, -this.height / 2),
                new THREE.Vector3(x, 0,  this.height / 2),
            );
        }
        
        condition = (this.segments % 2 === 0) ? this.height / 2 + 1 : this.height / 2;
        for (let z = -this.height / 2; z <= condition; z += this.height / this.segments) {
            geometry.vertices.push(
                new THREE.Vector3(-this.width / 2, 0, z),
                new THREE.Vector3(this.width  / 2, 0, z),
            );
        }

        const material = new THREE.LineBasicMaterial({ color: this.color, transparent: true });
        material.opacity = this.opacity;
        
        this.mesh = new THREE.LineSegments(geometry, material);
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    }

    // ##############################################
    // # Public functions ###########################
    // ##############################################

    update(deltaT) {
        super.update(deltaT);

        const [camera] = this.scene.camera.camera;

        if (this.moveWithCamera) {
            const roundedOffset = new THREE.Vector3(
                (camera.position.x - this.cameraOffset.x) % (this.width  / this.segments),
                camera.position.y  - this.cameraOffset.y,
                (camera.position.z - this.cameraOffset.z) % (this.height / this.segments),
            );

            const newPosition = camera.position
                .clone()
                .sub(this.cameraOffset)
                .sub(roundedOffset);

            this.position.set(
                newPosition.x,
                newPosition.y,
                newPosition.z,
            );

            this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        }
    }
} // class

export default Grid;
