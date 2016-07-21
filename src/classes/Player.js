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
                this.accelerationChange.x = 2E-24;
            }

            // ##############################################

            decelerate() {
                this.accelerationChange.x = -2E-24;
            }

            // ##############################################

            turnLeft() {
                // Get the angle in radians so we can add to it
                let angle = Math.atan2(this.orientation.y, this.orientation.x);
                angle += Math.PI / 60;

                this.orientation.x = Math.cos(angle);
                this.orientation.y = Math.sin(angle);
            }

            // ##############################################

            turnRight() {
                // Get the angle in radians so we can add to it
                let angle = Math.atan2(this.orientation.y, this.orientation.x);
                angle -= Math.PI / 60;

                this.orientation.x = Math.cos(angle);
                this.orientation.y = Math.sin(angle);
            }

            // ##############################################

            update(deltaT, smoothDeltaT, spaceObjects) {
                super.update(deltaT, smoothDeltaT, spaceObjects);

                if(this.positionIndicator) {
                    this.positionIndicator.rotation.y = Math.atan2(this.orientation.y, this.orientation.x) - Math.PI / 2;
                }
            }

            // ##############################################

            force(position, mass, id, gameObjects) {
                let vec = super.force(position, mass, id, gameObjects);

                vec.add(this.accelerationChange.multiply(this.orientation));

                this.accelerationChange.set(0, 0, 0);

                return vec;
            }
        }
    }
);