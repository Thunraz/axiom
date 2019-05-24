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

    update() { }

    // ##############################################
    // # Static functions ###########################
    // ##############################################
    
    static get NEXT_ID() {
        if(this._NEXT_ID == undefined) {
            this._NEXT_ID = 0;
        }

        let val = this._NEXT_ID;
        this._NEXT_ID++;

        return val;
    }
} // class

export default SpaceObject;
