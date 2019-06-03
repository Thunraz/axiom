import * as THREE from 'three';

let SPACEOBJECT_ID = 0;

class SpaceObject {
    // ##############################################
    // # Constructor ################################
    // ##############################################

    constructor() {
        this.id       = SpaceObject.NEXT_ID;

        this.position = new THREE.Vector3(0, 0, 0);
    }

    // ##############################################
    // # Public functions ###########################
    // ##############################################

    // eslint-disable-next-line class-methods-use-this
    update() { }

    // ##############################################
    // # Static functions ###########################
    // ##############################################
    
    static get NEXT_ID() {
        const val = SPACEOBJECT_ID;
        SPACEOBJECT_ID += 1;

        return val;
    }
} // class

export default SpaceObject;
