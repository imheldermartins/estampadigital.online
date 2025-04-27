import MugModel from "./MugModel";

import * as THREE from "three";

class SimpleMugMesh extends MugModel {

    constructor(pos?: THREE.Vector3, rot?: THREE.Euler, scale?: THREE.Vector3) {

        super(pos, rot, scale);
    }
}

export { SimpleMugMesh };