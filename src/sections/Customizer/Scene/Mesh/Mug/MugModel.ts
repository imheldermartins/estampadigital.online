import Mesh from "../Mesh";

import { parseHexColor } from "../../shared";

import * as THREE from "three";

abstract class MugModel extends Mesh {

    bodyColor: string = '#ffffff';
    handleColor: string = '#ffffff';
    innerColor: string = '#ffffff';

    constructor(pos?: THREE.Vector3, rot?: THREE.Euler, scale?: THREE.Vector3) {
        super(pos, rot, scale);
    }

    get colors(): Array<number> {

        return [
            parseHexColor(this.bodyColor),
            parseHexColor(this.handleColor),
            parseHexColor(this.innerColor)
        ];
    }

    public changeLogoTexture(file?: File): void {
        // const texture = new THREE.TextureLoader().load(newTexPath);

        console.log('materials >> ', this.materials);
    }
}

export default MugModel;