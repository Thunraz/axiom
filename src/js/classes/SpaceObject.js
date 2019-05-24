import * as THREE from 'three';

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
        if (!this.NEXT_ID) {
            this.NEXT_ID = 0;
        }

        const val = this.NEXT_ID;
        this.NEXT_ID += 1;

        return val;
    }
} // class

export default SpaceObject;
