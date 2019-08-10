import * as THREE from 'three';

import Constants   from '../enums/Constants';
import SpaceObject from './SpaceObject';

import config from '../config';

class AstronomicalObject extends SpaceObject {
    // ##############################################
    // # Constructor ################################
    // ##############################################
    
    constructor() {
        super();
        
        this.mass  = 0.0;

        this.velocity     = new THREE.Vector3(0.0, 0.0, 0.0);
        this.acceleration = new THREE.Vector3(0.0, 0.0, 0.0);
    }

    // ##############################################
    // # Private functions ##########################
    // ##############################################

    createDirectionalArrow() {
        const vertices = new Float32Array([
            this.position.x, this.position.y, this.position.z,

            this.position.x, this.position.y, this.position.z,
        ]);

        const colors = new Float32Array([
            ((this.color & 0xff0000) >> 16) / 256,
            ((this.color & 0x00ff00) >>  8) / 256,
            (this.color  & 0x0000ff)        / 256,

            ((this.color & 0xff0000) >> 16) / 256,
            ((this.color & 0x00ff00) >>  8) / 256,
            (this.color  & 0x0000ff)        / 256,
        ]);

        this.arrowGeometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
        this.arrowGeometry.addAttribute('color',    new THREE.BufferAttribute(colors,   3));

        const material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });

        return new THREE.Line(this.arrowGeometry, material);
    }

    // ##############################################

    createYPosition(scene, r) {
        let radius = r;

        // Create initial line to xz plane
        const vertices = new Float32Array([
            this.position.x, this.position.y, this.position.z,

            this.position.x, 0, this.position.z,
        ]);

        const colors = new Float32Array([
            ((this.color & 0xff0000) >> 16) / 256,
            ((this.color & 0x00ff00) >>  8) / 256,
            (this.color  & 0x0000ff)        / 256,

            ((this.color & 0xff0000) >> 16) / 256,
            ((this.color & 0x00ff00) >>  8) / 256,
            (this.color  & 0x0000ff)        / 256,
        ]);

        const lineMaterial = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.attributes.position = new THREE.BufferAttribute(new Float32Array(vertices), 3);
        lineGeometry.attributes.color    = new THREE.BufferAttribute(new Float32Array(colors),   3);

        this.YPosition = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(this.YPosition);

        if (radius) {
            // Create circle
            const circleGeometry = new THREE.Geometry();
            const numberSegments = 16;
            const circleSegment  = (2 * Math.PI) / numberSegments;
            radius *= 0.02;

            if (radius < 1) radius = 1;

            for (let i = 0; i <= numberSegments; i++) {
                const position = new THREE.Vector3(
                    radius * Math.cos(i * circleSegment),
                    0,
                    radius * Math.sin(i * circleSegment),
                );

                circleGeometry.vertices.push(position);
            }

            const circleMaterial = new THREE.LineBasicMaterial({ color: this.color });
            this.YPositionCircle = new THREE.Line(circleGeometry, circleMaterial);
            scene.add(this.YPositionCircle);
        }
    }

    // ##############################################

    updateYPosition() {
        // Throw error if _createYPosition hasn't been called before
        if (!this.YPosition) {
            throw new Error('yPosition hasn\'t been defined. (call _createYPosition first)');
        }

        const vertices = new Float32Array([
            this.position.x, this.position.y, this.position.z,
            this.position.x, 0, this.position.z,
        ]);

        const colors = new Float32Array([
            ((this.color & 0xff0000) >> 16) / 256,
            ((this.color & 0x00ff00) >>  8) / 256,
            (this.color & 0x0000ff)         / 256,

            ((this.color & 0xff0000) >> 16) / 256,
            ((this.color & 0x00ff00) >>  8) / 256,
            (this.color & 0x0000ff)         / 256,
        ]);

        // Clean up old geometry
        this.YPosition.geometry.dispose();
        this.YPosition.geometry = null;
        this.YPosition.geometry = new THREE.BufferGeometry();

        this.YPosition.geometry.attributes.position = new THREE.BufferAttribute(
            new Float32Array(vertices), 3,
        );
        this.YPosition.geometry.attributes.color = new THREE.BufferAttribute(
            new Float32Array(colors), 3,
        );

        if (this.YPositionCircle) {
            // Move circle if it exists
            this.YPositionCircle.position.set(this.position.x, 0, this.position.z);
        }
    }

    // ##############################################
    // # Public functions ###########################
    // ##############################################

    updatePosition(deltaT, smoothDeltaT, gameObjects) {
        this.acceleration = this.force(
            this.position,
            this.mass,
            this.id,
            gameObjects,
        ).divideScalar(this.mass);

        this.position = this.position.add(
            this.velocity
                .add(this.acceleration.multiplyScalar(deltaT / 2)),
        );

        // Only calculate this if config value is set
        if (config.showDirectionalVectors) {
            if (this.arrowGeometry == null) {
                this.arrowGeometry = new THREE.BufferGeometry();
            }

            const directionalVector = this.position.clone();
            const scale = this.radius || 50.0;
            directionalVector.add(
                this.velocity
                    .clone()
                    .normalize()
                    .multiplyScalar(this.velocity.length() * scale),
            );
            
            const vertices = new Float32Array([
                this.position.x, this.position.y, this.position.z,

                directionalVector.x, directionalVector.y, directionalVector.z,
            ]);
            this.arrowGeometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
        }
    }

    // ##############################################

    update(deltaT, smoothDeltaT, gameObjects) {
        super.update(deltaT);

        const newAcceleration = this.force(
            this.position,
            this.mass,
            this.id,
            gameObjects,
        ).divideScalar(this.mass);
            
        this.velocity = this.velocity.add(
            this.acceleration
                .add(newAcceleration)
                .multiplyScalar(deltaT),
        );

        if (this.showYPosition) {
            this.updateYPosition();
        }
    }

    // ##############################################
    // # Static functions ###########################
    // ##############################################

    // eslint-disable-next-line class-methods-use-this
    force(position, mass, id, gameObjects) {
        const vec = new THREE.Vector3(0, 0, 0);

        for (let i = 0; i < gameObjects.length; i++) {
            const spaceObject = gameObjects[i];

            if (spaceObject.id !== id && spaceObject instanceof AstronomicalObject) {
                const distance = position.distanceTo(spaceObject.position);
                const val = (Constants.GRAVITATIONAL_CONSTANT * (mass * spaceObject.mass))
                    / (distance ** 2);

                const direction = new THREE.Vector3(0, 0, 0)
                    .subVectors(spaceObject.position, position)
                    .normalize()
                    .multiplyScalar(val);

                vec.add(direction);
            }
        }
        return vec;
    }
} // class

export default AstronomicalObject;
