'use strict';
define(
    [
        'app/config',
        'three',
        'app/classes/Debug',
        'app/classes/AstronomicalObject',
        'app/classes/AstronomicalObjectType',
        'app/classes/GameObjectManager'
    ],
    function(config, THREE, Debug, AstronomicalObject, AstronomicalObjectType, GameObjectManager) {
        return class SpaceShip extends AstronomicalObject {

            // ##############################################
            // # Constructor ################################
            // ##############################################

            constructor(scene, name, mass, position) {
                super();

                this.scene    = scene;

                this.name     = name;
                this.mass     = mass;
                this.position = position;
                this.color    = 0x7fffd4;

                let that   = this;

                let loader = new THREE.JSONLoader();
                loader.load('assets/models/ship.json', function(shipGeometry, shipMaterials) {
                    let shipMaterial = new THREE.MultiMaterial(shipMaterials);
                    that.shipMesh    = new THREE.Mesh(shipGeometry, shipMaterial);
                    scene.add(that.shipMesh);

                    that._createPositionIndicator();
                    that._createInitialTrajectory();
                });

                if(config.showDirectionalVectors) {
                    this.arrowMesh = this._createDirectionalArrow();
                    this.scene.add(this.arrowMesh);
                }
            }

            // ##############################################
            // # Private functions ##########################
            // ##############################################

            _createPositionIndicator() {
                let positionIndicatorGeometry = new THREE.Geometry();
                    
                let numberSegments = 16;
                let circleSegment = 2 * Math.PI / numberSegments;
                let circleRadius = this.shipMesh.geometry.boundingSphere.radius;

                for(let i = 0; i <= numberSegments; i++) {
                    let vector = new THREE.Vector3(
                        circleRadius * Math.cos(i * circleSegment),
                        circleRadius * Math.sin(i * circleSegment),
                        0
                    );

                    positionIndicatorGeometry.vertices.push(vector);
                }
                
                let positionIndicatorMaterial = new THREE.LineBasicMaterial({ color: 0x7fffd4 });
                this.positionIndicator        = new THREE.Line(positionIndicatorGeometry, positionIndicatorMaterial);
                this.scene.add(this.positionIndicator);
            }

            // ##############################################

            _createInitialTrajectory() {
                let geometry  = new THREE.BufferGeometry();
                let material  = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
                let positions = [this.position.x, this.position.y, this.position.z];
                let colors    = [1, 1, 1];
                let tPosition = this.position.clone();
                let tVelocity = this.velocity.clone();

                geometry.removeAttribute('position');
                geometry.removeAttribute('color');

                geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
                geometry.addAttribute('color',    new THREE.BufferAttribute(new Float32Array(colors),    3));

                this.trajectory = new THREE.Line(geometry, material);
                this.scene.add(this.trajectory);
            }

            // ##############################################

            _updateTrajectory(deltaT, spaceObjects) {
                if(this.trajectory) {
                    let positions   = [this.position.x, this.position.y, this.position.z];
                    let colors      = [1, 1, 1];
                    let tPosition   = this.position.clone();
                    let tVelocity   = this.velocity.clone();
                    let n           = 1000;
                    let gameObjects = GameObjectManager.get();

                    for(let i = 1; i < n; i++) {
                        let tAcceleration = AstronomicalObject.force(
                                tPosition,
                                this.mass,
                                this.id,
                                gameObjects)
                            .divideScalar(this.mass);

                        tPosition = tPosition.add(
                            tVelocity
                                .add(tAcceleration.multiplyScalar(deltaT / 2))
                        );

                        let newAcceleration = AstronomicalObject.force(
                                tPosition,
                                this.mass,
                                this.id, gameObjects)
                            .divideScalar(this.mass);

                        tVelocity = tVelocity.add(
                            tAcceleration.add(newAcceleration).multiplyScalar(deltaT)
                        );

                        let col = 1 - (i / n / 2 + 0.5);

                        if(i % 25 == 0) {
                            positions.push(tPosition.x, tPosition.y, tPosition.z);
                            colors.push(col, col, col);
                        }
                    }
                    
                    this.trajectory.geometry.removeAttribute('position');
                    this.trajectory.geometry.removeAttribute('color');
                    
                    this.trajectory.geometry.attributes.position = new THREE.BufferAttribute(new Float32Array(positions), 3);
                    this.trajectory.geometry.attributes.color    = new THREE.BufferAttribute(new Float32Array(colors),    3);
                }
            }

            // ##############################################
            // # Public functions ###########################
            // ##############################################
            
            update(deltaT, spaceObjects) {
                super.update(deltaT, spaceObjects);

                this._updateTrajectory(deltaT, spaceObjects);

                let camera = this.scene.camera.camera;

                if(this.shipMesh == null) return;
                this.shipMesh.position.set(this.position.x, this.position.y, this.position.z);
                this.positionIndicator.position.set(this.position.x, this.position.y, this.position.z);
                this.positionIndicator.scale.set(
                    2 + 1 / camera.zoom,
                    2 + 1 / camera.zoom,
                    2 + 1 / camera.zoom
                );

                if(camera.zoom >= 25) {
                    this.positionIndicator.visible = false;
                } else {
                    this.positionIndicator.visible = true;
                }

                if(config.showDirectionalVectors && !this.arrowMesh) {
                    this.arrowMesh = this._createDirectionalArrow();
                    this.scene.add(this.arrowMesh);
                }

                if(this.arrowMesh) {
                    this.arrowMesh.visible = config.showDirectionalVectors;
                }
            }
        }
    }
);