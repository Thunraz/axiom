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

            _createYPosition(scene, radius) {
                // Create initial line to xz plane
                let vertices = new Float32Array([
                    this.position.x, this.position.y, this.position.z,
                    this.position.x, 0, this.position.z
                ]);

                let colors = new Float32Array([
                    ((this.color & 0xff0000) >> 16) / 256, ((this.color & 0x00ff00) >> 8) / 256, (this.color & 0x0000ff) / 256,
                    ((this.color & 0x330000) >> 16) / 256, ((this.color & 0x003300) >> 8) / 256, (this.color & 0x000033) / 256,
                ]);

                let lineMaterial = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
                let lineGeometry = new THREE.BufferGeometry();
                lineGeometry.attributes.position = new THREE.BufferAttribute(new Float32Array(vertices), 3);
                lineGeometry.attributes.color    = new THREE.BufferAttribute(new Float32Array(colors),   3);

                this.YPosition = new THREE.Line(lineGeometry, lineMaterial);
                scene.add(this.YPosition);

                if(radius) {
                    // Create circle
                    let circleGeometry = new THREE.Geometry();
                    let numberSegments = 16;
                    let circleSegment  = 2 * Math.PI / numberSegments;
                    radius *= .02;

                    if(radius < 1) radius = 1;

                    for(let i = 0; i <= numberSegments; i++) {
                        let position = new THREE.Vector3(
                            radius * Math.cos(i * circleSegment),
                            0,
                            radius * Math.sin(i * circleSegment)
                        );

                        circleGeometry.vertices.push(position);
                    }

                    let circleMaterial = new THREE.LineBasicMaterial({ color: this.color });
                    this.YPositionCircle = new THREE.Line(circleGeometry, circleMaterial);
                    scene.add(this.YPositionCircle);
                }
            }

            // ##############################################

            _updateYPosition() {
                // Throw error if _createYPosition hasn't been called before
                if(!this.YPosition) {
                    throw new Error('yPosition hasn\'t been defined. (call _createYPosition first)');
                }

                let vertices = new Float32Array([
                    this.position.x, this.position.y, this.position.z,
                    this.position.x, 0, this.position.z
                ]);

                let colors = new Float32Array([
                    ((this.color & 0xff0000) >> 16) / 256, ((this.color & 0x00ff00) >> 8) / 256, (this.color & 0x0000ff) / 256,
                    ((this.color & 0x330000) >> 16) / 256, ((this.color & 0x003300) >> 8) / 256, (this.color & 0x000033) / 256,
                ]);

                // Clean up old geometry
                this.YPosition.geometry.dispose();
                this.YPosition.geometry = null;
                this.YPosition.geometry = new THREE.BufferGeometry();

                this.YPosition.geometry.attributes.position = new THREE.BufferAttribute(new Float32Array(vertices), 3);
                this.YPosition.geometry.attributes.color    = new THREE.BufferAttribute(new Float32Array(colors),   3);

                if(this.YPositionCircle) {
                    // Move circle if it exists
                    this.YPositionCircle.position.set(this.position.x, 0, this.position.z);
                }
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

                if(this.showYPosition) {
                    this._updateYPosition();
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