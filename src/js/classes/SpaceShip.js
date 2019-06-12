import * as THREE from 'three';

import AstronomicalObject from './AstronomicalObject';

import config from '../config';

class SpaceShip extends AstronomicalObject {
    // ##############################################
    // # Constructor ################################
    // ##############################################

    constructor(scene, name, options) {
        super();

        this.scene    = scene;

        this.name     = name;
        this.mass     = options.mass     || 5;
        this.position = options.position || new THREE.Vector3();
        this.color    = options.color    || 0x7fffd4;
        options.model = options.model    || 'assets/models/ship.gltf';
        
        this.positionIndicatorScale = 3;

        const scope = this;

        const loader = new THREE.GLTFLoader();
        loader.load(options.model, (gltf) => {
            const [gltfObjects] = gltf.scene.children;
            [scope.mesh] = gltfObjects.children;
            scope.mesh.geometry.computeBoundingSphere();
            scene.add(scope.mesh);

            scope.createPositionIndicator();
            scope.createInitialTrajectory();
            scope.createYPosition(scene);
        });

        if (config.showDirectionalVectors) {
            this.arrowMesh = this.createDirectionalArrow();
            this.scene.add(this.arrowMesh);
        }
    }

    // ##############################################
    // # Private functions ##########################
    // ##############################################

    createPositionIndicator() {
        const positionIndicatorGeometry = new THREE.Geometry();
            
        const numberSegments = 16;
        const circleSegment = 2 * Math.PI / numberSegments;
        const circleRadius = this.mesh.geometry.boundingSphere.radius * 1.1;

        for (let i = 0; i <= numberSegments; i++) {
            const vector = new THREE.Vector3(
                circleRadius * Math.cos(i * circleSegment),
                0,
                circleRadius * Math.sin(i * circleSegment),
            );

            positionIndicatorGeometry.vertices.push(vector);
        }
        
        const positionIndicatorMaterial = new THREE.LineBasicMaterial({ color: 0x7fffd4 });
        this.positionIndicator = new THREE.Line(
            positionIndicatorGeometry,
            positionIndicatorMaterial,
        );
        this.scene.add(this.positionIndicator);
    }

    // ##############################################

    createInitialTrajectory() {
        const geometry  = new THREE.BufferGeometry();
        const material  = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
        const positions = [this.position.x, this.position.y, this.position.z];
        const colors    = [1, 1, 1];

        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        geometry.addAttribute('color',    new THREE.BufferAttribute(new Float32Array(colors),    3));

        this.trajectory = new THREE.Line(geometry, material);
        this.scene.add(this.trajectory);
    }

    // ##############################################

    updateTrajectory(deltaT, smoothDeltaT, gameObjects) {
        if (this.trajectory) {
            const positions   = [this.position.x, this.position.y, this.position.z];
            const colors      = [1, 1, 1];
            let tPosition   = this.position.clone();
            let tVelocity   = this.velocity.clone();
            const n           = 1000;

            for (let i = 1; i < n; i++) {
                const tAcceleration = this.force(
                    tPosition,
                    this.mass,
                    this.id,
                    gameObjects,
                ).divideScalar(this.mass);

                tPosition = tPosition.add(
                    tVelocity
                        .add(tAcceleration.multiplyScalar(smoothDeltaT / 2)),
                );

                const newAcceleration = this.force(
                    tPosition,
                    this.mass,
                    this.id,
                    gameObjects,
                ).divideScalar(this.mass);

                tVelocity = tVelocity.add(
                    tAcceleration.add(newAcceleration).multiplyScalar(smoothDeltaT),
                );

                const col = 1 - (i / n / 2 + 0.5);

                if (i % 25 === 0) {
                    positions.push(tPosition.x, tPosition.y, tPosition.z);
                    colors.push(col, col, col);
                }
            }
            
            this.trajectory.geometry.dispose();
            this.trajectory.geometry = null;
            this.trajectory.geometry = new THREE.BufferGeometry();
            
            this.trajectory.geometry.attributes.position = new THREE.BufferAttribute(
                new Float32Array(positions), 3,
            );
            this.trajectory.geometry.attributes.color = new THREE.BufferAttribute(
                new Float32Array(colors), 3,
            );
        }
    }

    // ##############################################
    // # Public functions ###########################
    // ##############################################
    
    update(deltaT, smoothDeltaT, spaceObjects) {
        super.update(deltaT, smoothDeltaT, spaceObjects);

        this.updateTrajectory(deltaT, smoothDeltaT, spaceObjects);

        if (this.mesh) {
            this.updateYPosition();
        }

        if (this.mesh == null) return;
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.positionIndicator.position.set(this.position.x, 0, this.position.z);

        const { controls, camera } = this.scene.camera;

        const zoomFactor = controls.target.clone().sub(camera.position).length() / 100;
        this.positionIndicator.scale.set(
            this.positionIndicatorScale * zoomFactor,
            this.positionIndicatorScale * zoomFactor,
            this.positionIndicatorScale * zoomFactor,
        );

        if (config.showDirectionalVectors && !this.arrowMesh) {
            this.arrowMesh = this.createDirectionalArrow();
            this.scene.add(this.arrowMesh);
        }

        if (this.arrowMesh) {
            this.arrowMesh.visible = config.showDirectionalVectors;
        }
    }
}

export default SpaceShip;
