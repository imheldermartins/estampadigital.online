import Mesh from "../Mesh";

import { parseHexColor } from "../../shared";

import * as THREE from "three";
import { VisualElement } from "../VisualElement";

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

    changeTexture(file: File, name?: string, onChangeTexture?: (visualElement: VisualElement[]) => void): VisualElement[] | void {

        if (!this.materials) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const texture = new THREE.TextureLoader().load(event.target?.result as string, () => {

                texture.flipY = false; // Not inverts the texture

                // Set the texture of visual elements
                if (this.visualElements.length > 0) {
                    this.visualElements.forEach((visualElement) => {
                        if (visualElement.id === (name || "logo")) {
                            visualElement.texture = texture;
                        }
                    });
                    onChangeTexture?.([...this.visualElements]);
                }

                (this.materials as THREE.MeshBasicMaterial[]).forEach(m => {
                    if (m.name === (name || "logo")) {
                        m.map = texture;
                        m.needsUpdate = true;
                    }
                });
            });
        };

        return this.visualElements;
    };
}

export default MugModel;