import * as THREE from 'three';

import SpaceShip from './SpaceShip';

class Player extends SpaceShip {
    // ##############################################
    // # Constructor ################################
    // ##############################################

    constructor(scene, name, options) {
        if (!scene || !name || !options || typeof options !== 'object') {
            throw new Error('Player has not been initialized properly.');
        }

        options.model = 'assets/models/ship.gltf';

        super(scene, name, options);
        this.positionIndicatorScale = 1;

        this.thrust = 0.0;

        this.elements = {
            thrust: document.getElementById('thrust'),
            speed:  document.getElementById('playerSpeed'),
        };
    }

    // ##############################################
    // # Private functions ##########################
    // ##############################################

    _createPositionIndicator() {
        const arrowGeometry = new THREE.Geometry();

        const xOffset = 3;
        const zOffset = 3;

        // Push vertices for the arrow
        arrowGeometry.vertices.push(new THREE.Vector3(0 - xOffset, 0, 6 - zOffset));
        arrowGeometry.vertices.push(new THREE.Vector3(3 - xOffset, 0, 0 - zOffset));
        arrowGeometry.vertices.push(new THREE.Vector3(6 - xOffset, 0, 6 - zOffset));
        arrowGeometry.vertices.push(new THREE.Vector3(3 - xOffset, 0, 4 - zOffset));
        arrowGeometry.vertices.push(new THREE.Vector3(0 - xOffset, 0, 6 - zOffset));
        
        const arrowMaterial      = new THREE.LineBasicMaterial({ color: 0x7fffd4 });
        this.positionIndicator = new THREE.Line(arrowGeometry, arrowMaterial);
        this.positionIndicator.position.set(this.position.x, this.position.y, this.position.z);
        this.scene.add(this.positionIndicator);
    }
    
    // ##############################################
    // # Public functions ###########################
    // ##############################################

    accelerate() {
        this.thrust += 0.01;
        if (this.thrust > 1.0) {
            this.thrust = 1.0;
        }
    }

    // ##############################################

    decelerate() {
        this.thrust -= 0.01;
        if (this.thrust < 0.0) {
            this.thrust = 0.0;
        }
    }

    // ##############################################

    turnLeft() {
        this.mesh.rotation.y += Math.PI / 60;
    }

    // ##############################################

    turnRight() {
        this.mesh.rotation.y -= Math.PI / 60;
    }

    // ##############################################

    update(deltaT, smoothDeltaT, spaceObjects) {
        super.update(deltaT, smoothDeltaT, spaceObjects);

        if (this.positionIndicator) {
            this.positionIndicator.rotation.set(
                this.mesh.rotation.x,
                this.mesh.rotation.y - Math.PI / 2,
                this.mesh.rotation.z,
            );
        }

        this.elements.thrust.style.height = `${this.thrust * 100}%`;
        this.elements.speed.innerText = `current velocity: ${Math.round(this.velocity.length() * 1000)}`;
    }

    // ##############################################

    force(position, mass, id, gameObjects) {
        const vec = super.force(position, mass, id, gameObjects);

        if (!this.mesh) return vec;
        
        const accelerationChange = new THREE.Vector3(0, 0, 0);
        accelerationChange.set(
            Math.cos(this.mesh.rotation.y),
            0,
            -Math.sin(this.mesh.rotation.y),
        );

        accelerationChange.multiplyScalar(this.thrust * 2E-24);
        vec.add(accelerationChange);

        return vec;
    }
}

export default Player;
