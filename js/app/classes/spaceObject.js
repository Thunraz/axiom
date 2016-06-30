'use strict';
define(
    ['three'],
    function(THREE) {
        return class SpaceObject {
            constructor() {
                this.mass = 1.0;
                this.position = new THREE.Vector3(0.0, 0.0, 0.0);
                this.velocity = new THREE.Vector3(0.0, 0.0, 0.0);
            }

            update(deltaT) { }
        }
    }
);