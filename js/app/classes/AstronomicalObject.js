'use strict';
define(
    ['app/classes/spaceObject'],
    function(SpaceObject) {
        return class AstronomicalObject extends SpaceObject {
            constructor() {
                super();
            }
        }
    }
);