'use strict';
define(
    [
        'three',
        'SpaceShip',
        'Debug'
    ],
    function(THREE, SpaceShip, Debug) {
        return class Player extends SpaceShip {
            
            // ##############################################
            // # Constructor ################################
            // ##############################################

            constructor(scene, name, options) {
                if(!scene || !name || !options || typeof(options) !== 'object') {
                    throw new Error('Player has not been initialized properly.');
                }

                options.model = 'assets/models/ship.json';

                super(scene, name, options);
                this.positionIndicatorScale = 1;

                this.accelerationChange = new THREE.Vector3(0, 0, 0);
            }

            // ##############################################
            // # Private functions ##########################
            // ##############################################

            _createPositionIndicator() {
                let arrowGeometry = new THREE.Geometry();

                let xOffset = 3;
                let zOffset = 3;

                // Push vertices for the arrow
                arrowGeometry.vertices.push(new THREE.Vector3(0 - xOffset, 0, 6 - zOffset));
                arrowGeometry.vertices.push(new THREE.Vector3(3 - xOffset, 0, 0 - zOffset));
                arrowGeometry.vertices.push(new THREE.Vector3(6 - xOffset, 0, 6 - zOffset));
                arrowGeometry.vertices.push(new THREE.Vector3(3 - xOffset, 0, 4 - zOffset));
                arrowGeometry.vertices.push(new THREE.Vector3(0 - xOffset, 0, 6 - zOffset));
                
                let arrowMaterial      = new THREE.LineBasicMaterial({ color: 0x7fffd4 });
                this.positionIndicator = new THREE.Line(arrowGeometry, arrowMaterial);
                this.positionIndicator.position.set(this.position.x, this.position.y, this.position.z);
                this.scene.add(this.positionIndicator);
            }
            
            // ##############################################
            // # Public functions ###########################
            // ##############################################

            accelerate() {
                this.accelerationChange.set(2E-24, 2E-24);
            }

            // ##############################################

            decelerate() {
                this.accelerationChange.set(2E-24, 2E-24);
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

                Debug.log(this.mesh ? this.mesh.rotation : '');

                if(this.positionIndicator) {

                    this.positionIndicator.rotation.set(
                        this.mesh.rotation.x,
                        this.mesh.rotation.y - Math.PI / 2,
                        this.mesh.rotation.z
                    );
                }
            }

            // ##############################################

            force(position, mass, id, gameObjects) {
                let vec = super.force(position, mass, id, gameObjects);

                let orientation = new THREE.Vector3(
                    Math.cos(this.mesh ? this.mesh.rotation.y : 0),
                    0,
                    Math.sin(this.mesh ? this.mesh.rotation.y : 0)
                );

                vec.add(this.accelerationChange.multiply(orientation));

                this.accelerationChange.set(0, 0, 0);

                return vec;
            }
        }
    }
);