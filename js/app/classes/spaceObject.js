'use strict';
define(
    ['three'],
    function(THREE) {
        return class SpaceObject {
            constructor() {
                this.mass = 1.0;
                this.position     = new THREE.Vector3(0.0, 0.0, 0.0);
                this.velocity     = new THREE.Vector3(1.0, 0.0, 0.0);
                this.acceleration = new THREE.Vector3(0.0, 0.0, 0.0);

                this.counter = 0;
            }

            updatePosition(time, deltaT) {
                /*
                Velocity Verlet:

                acceleration = force(time, position) / mass;
                time += timestep;
                position += timestep * (velocity + timestep * acceleration / 2);
                */
                this.acceleration = this.force(time, this.position).divideScalar(this.mass);
                this.position = this.position.add(
                    this.velocity.add(this.acceleration.multiplyScalar(deltaT / 2)).multiplyScalar(deltaT)
                );

                if (this.counter <= 10) {
                    console.log(this.name);
                    console.log(this.velocity);
                    this.counter++;
                }
            }

            update(deltaT) { }

            force(time, position) {
                return new THREE.Vector3(1.0, 1.0, 1.0);
            }
        }
    }
);