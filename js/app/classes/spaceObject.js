define(
    ['three', 'app/classes/spaceObjectType'],
    function(THREE, SpaceObjectType) {
        function SpaceObject() {
            this.radius = 1.0;
            this.mass = 1.0;
            this.position = THREE.Vector3(0, 0, 0);
            this.spaceObjectType = SpaceObjectType.NONE;
        }

        return SpaceObject;
    }
);