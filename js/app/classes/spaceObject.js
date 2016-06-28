define(
    ['three', 'app/classes/spaceObjectType'],
    function(THREE, SpaceObjectType) {
        return class SpaceObject {
            constructor() {
                this.radius = 1.0;
                this.mass = 1.0;
                this.position = THREE.Vector3(0, 0, 0);
                this.spaceObjectType = SpaceObjectType.NONE;
            }
        }
    }
);