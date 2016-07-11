'use strict';
define(
    ['three', 'app/classes/AstronomicalObject', 'app/classes/AstronomicalObjectType', 'app/config'],
    function(THREE, AstronomicalObject, AstronomicalObjectType, config) {
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

                    // Create position indicator
                    let positionIndicatorGeometry = new THREE.Geometry();
                    
                    let numberSegments = 16;
                    let circleSegment = 2 * Math.PI / numberSegments;
                    let circleRadius = that.shipMesh.geometry.boundingSphere.radius;

                    for(let i = 0; i <= numberSegments; i++) {
                        let vector = new THREE.Vector3(
                            circleRadius * Math.cos(i * circleSegment),
                            circleRadius * Math.sin(i * circleSegment),
                            0
                        );

                        positionIndicatorGeometry.vertices.push(vector);
                    }
                    
                    let positionIndicatorMaterial = new THREE.LineBasicMaterial({ color: 0x7fffd4 });
                    that.positionIndicator = new THREE.Line(positionIndicatorGeometry, positionIndicatorMaterial);
                    scene.add(that.positionIndicator);
                });

                if(config.showDirectionalVectors) {
                    this.arrowMesh = this._createDirectionalArrow();
                    this.scene.add(this.arrowMesh);
                }
            }

            // ##############################################
            // # Public functions ###########################
            // ##############################################
            
            update(deltaT, spaceObjects) {
                super.update(deltaT, spaceObjects);

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