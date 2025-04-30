import * as THREE from "three";

import Mesh from "./Mesh";
import { VisualElement } from "./VisualElement";

export function createVisualElementsFromMesh(mesh: Mesh): VisualElement[] {
    const visualElements: VisualElement[] = [];

    const texturedMaterials = mesh.texturedMaterials as THREE.MeshStandardMaterial[];

    texturedMaterials.forEach((mtl) => {
        visualElements.push(
            new VisualElement({
                id: mtl.name,
                texture: mtl.map,
                color: mtl.color.getHex(),
                isTransparent: mtl.transparent,
            })
        );
    });

    return visualElements;
}

export function imageBitmapToDataURL(imageBitmap: ImageBitmap): string {
    const canvas = document.createElement('canvas');
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error("Could not get canvas context");
    }

    ctx.drawImage(imageBitmap, 0, 0);
    return canvas.toDataURL('image/png');
}
