import * as THREE from 'three';

import SpaceObject from './SpaceObject';

class TrailParticle extends SpaceObject {
    // ##############################################
    // # Constructor ################################
    // ##############################################

    constructor(scene, parent, position, oldPosition, lifetime) {
        super();

        this.scene    = scene;

        this.position = position;
        this.color    = parent.color;

        this.lifetime = lifetime;
        this.life     = 0.0;
        this.alive    = this.life < this.lifetime;
        
        this.mesh     = null;
        this.createMesh(position, oldPosition);
        this.scene.add(this.mesh);
    }

    // ##############################################
    // # Private functions ##########################
    // ##############################################

    createMesh(newPos, oldPos) {
        const material = new THREE.LineBasicMaterial({ color: this.color, transparent: true });

        const geometry = new THREE.Geometry();
        geometry.vertices.push(oldPos, newPos);
        
        this.mesh = new THREE.Line(geometry, material);
    }

    // ##############################################
    // # Public functions ###########################
    // ##############################################

    update(deltaT) {
        super.update(deltaT);

        if (this.life <= this.lifetime) {
            const factor = 1 - this.life / this.lifetime / 50;

            // Fade to black (alpha not available)
            this.mesh.material.color.r *= factor;
            this.mesh.material.color.g *= factor;
            this.mesh.material.color.b *= factor;

            this.mesh.material.opacity *= factor;

            this.life += deltaT / 1000;
        } else {
            this.alive = false;
            this.scene.remove(this.mesh);
            this.mesh.material.dispose();
            this.mesh.geometry.dispose();
            this.mesh = null;
        }
    }

    // ##############################################
} // class

export default TrailParticle;
