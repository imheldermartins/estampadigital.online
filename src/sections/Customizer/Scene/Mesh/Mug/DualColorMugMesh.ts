import { parseHexColor } from "../../shared";
import MugModel from "./MugModel";

import * as THREE from "three";

class DualColorMugMesh extends MugModel {

    constructor(pos?: THREE.Vector3, rot?: THREE.Euler, scale?: THREE.Vector3) {

        super(pos, rot, scale);
    }

    changeSecondayColor(color: string, name?: string): void {

        if (!this.materials) return;

        (this.materials as THREE.MeshBasicMaterial[]).forEach(m => {
            if (m.name === (name || "handle-colorized")) {
                m.color.set(parseHexColor(color));
                m.needsUpdate = true;
            }
        });
    }
}

export { DualColorMugMesh };