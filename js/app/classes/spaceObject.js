'use strict';
define(
    ['three'],
    function(THREE) {
        return class SpaceObject {
            constructor() {
                this.position = new THREE.Vector3(0.0, 0.0, 0.0);
            }

            update(deltaT) { }
        }
    }
);