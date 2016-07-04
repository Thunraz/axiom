'use strict';
define(
    ['app/classes/SpaceObject', 'app/classes/Constants', 'app/config'],
    function(SpaceObject, Constants, config) {
        return class AstronomicalObject extends SpaceObject {

            // ##############################################
            // # Constructor ################################
            // ##############################################
            
            constructor() {
                super();
                
                this.mass         = 0.0;

                this.velocity     = new THREE.Vector3(0.0, 0.0, 0.0);
                this.acceleration = new THREE.Vector3(0.0, 0.0, 0.0);
            }

            // ##############################################
            // # Private functions ##########################
            // ##############################################

            _createDirectionalArrow() {
                let vertices = new Float32Array([
                    this.position.x, this.position.y, this.position.z,

                    5.0, 5.0, 10.0
                ]);

                let colors = new Float32Array([
                    ((this.color & 0xff0000) >> 16) / 256, ((this.color & 0x00ff00) >> 8) / 256, (this.color & 0x0000ff) / 256,
                    ((this.color & 0xff0000) >> 16) / 256, ((this.color & 0x00ff00) >> 8) / 256, (this.color & 0x0000ff) / 256,
                ]);

                this.arrowGeometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
                this.arrowGeometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

                let material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });

                return new THREE.Line(this.arrowGeometry, material);
            }

            // ##############################################
            // # Public functions ###########################
            // ##############################################

            updatePosition(deltaT, spaceObjects) {
                this.acceleration = AstronomicalObject.force(this.position, this.mass, this.id, spaceObjects).divideScalar(this.mass);

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
                    directionalVector.add(this.velocity.clone().normalize().multiplyScalar(this.velocity.length() * this.radius));
                    
                    let vertices = new Float32Array([
                        this.position.x, this.position.y, this.position.z,

                        directionalVector.x, directionalVector.y, directionalVector.z
                    ]);
                    this.arrowGeometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
                }
            }

            // ##############################################

            update(deltaT, spaceObjects) {
                super.update(deltaT, spaceObjects);

                let newAcceleration = AstronomicalObject.force(this.position, this.mass, this.id, spaceObjects).divideScalar(this.mass);
                this.velocity = this.velocity.add(
                    this.acceleration.add(newAcceleration).multiplyScalar(deltaT)
                );
            }

            // ##############################################
            // # Static functions ###########################
            // ##############################################

            static force(position, mass, id, spaceObjects) {
                let vec = new THREE.Vector3(0, 0, 0);

                for(let i = 0; i < spaceObjects.length; i++) {
                    let spaceObject = spaceObjects[i];

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