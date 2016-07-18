'use strict';
define(
    ['three', 'app/classes/SpaceObject', 'app/enums/Constants', 'app/config'],
    function(THREE, SpaceObject, Constants, config) {
        return class AstronomicalObject extends SpaceObject {

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

            _createDirectionalArrow() {
                let vertices = new Float32Array([
                    this.position.x, this.position.y, this.position.z,

                    this.position.x, this.position.y, this.position.z,
                ]);

                let colors = new Float32Array([
                    ((this.color & 0xff0000) >> 16) / 256, ((this.color & 0x00ff00) >> 8) / 256, (this.color & 0x0000ff) / 256,
                    ((this.color & 0xff0000) >> 16) / 256, ((this.color & 0x00ff00) >> 8) / 256, (this.color & 0x0000ff) / 256,
                ]);

                this.arrowGeometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
                this.arrowGeometry.addAttribute('color',    new THREE.BufferAttribute(colors,   3));

                let material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });

                return new THREE.Line(this.arrowGeometry, material);
            }

            // ##############################################

            _createZPosition() {
                let vertices = new Float32Array([
                    this.position.x, this.position.y, this.position.z,
                    this.position.x, this.position.y, 0,
                ]);

                let colors = new Float32Array([
                    ((this.color & 0xff0000) >> 16) / 256, ((this.color & 0x00ff00) >> 8) / 256, (this.color & 0x0000ff) / 256,
                    ((this.color & 0xff0000) >> 16) / 256, ((this.color & 0x00ff00) >> 8) / 256, (this.color & 0x0000ff) / 256,
                ]);

                this.zPosition = new THREE.BufferGeometry();
                this.zPosition.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
                this.zPosition.addAttribute('color',    new THREE.BufferAttribute(colors,   3));

                let material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });

                return new THREE.Line(this.zPosition, material);
            }

            // ##############################################

            _updateZPosition() {

            }

            // ##############################################
            // # Public functions ###########################
            // ##############################################

            updatePosition(deltaT, smoothDeltaT, gameObjects) {
                this.acceleration = AstronomicalObject.force(
                        this.position,
                        this.mass,
                        this.id,
                        gameObjects)
                    .divideScalar(this.mass);

                this.position = this.position.add(
                    this.velocity
                        .add(this.acceleration.multiplyScalar(deltaT / 2))
                );

                // Only calculate this if config value is set
                if(config.showDirectionalVectors) {
                    if(this.arrowGeometry == null) {
                        this.arrowGeometry = new THREE.BufferGeometry();
                    }

                    let directionalVector = this.position.clone();
                    let scale = this.radius || 50.0;
                    directionalVector.add(this.velocity.clone().normalize().multiplyScalar(this.velocity.length() * scale));
                    
                    let vertices = new Float32Array([
                        this.position.x, this.position.y, this.position.z,

                        directionalVector.x, directionalVector.y, directionalVector.z
                    ]);
                    this.arrowGeometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
                }
            }

            // ##############################################

            update(deltaT, smoothDeltaT, gameObjects) {
                super.update(deltaT);

                let newAcceleration = AstronomicalObject.force(
                        this.position,
                        this.mass,
                        this.id,
                        gameObjects)
                    .divideScalar(this.mass);
                    
                this.velocity = this.velocity.add(
                    this.acceleration.add(newAcceleration).multiplyScalar(deltaT)
                );

                if(this.showZPosition) {
                    this._updateZPosition();
                }
            }

            // ##############################################
            // # Static functions ###########################
            // ##############################################

            static force(position, mass, id, gameObjects) {
                let vec = new THREE.Vector3(0, 0, 0);

                for(let i = 0; i < gameObjects.length; i++) {
                    let spaceObject = gameObjects[i];

                    if(spaceObject.id == id) continue;

                    let distance = position.distanceTo(spaceObject.position);
                    let val = Constants.GRAVITATIONAL_CONSTANT * (mass * spaceObject.mass) / Math.pow(distance, 2);

                    let direction =
                        new THREE.Vector3(0, 0, 0)
                            .subVectors(spaceObject.position, position)
                            .normalize()
                            .multiplyScalar(val);

                    vec.add(direction);
                }
                return vec;
            }

            // ##############################################

        } // class
    }
);