import * as THREE from 'three';

class VisualElement {

    texture: THREE.Texture | null = null;
    size: number = 0;
    position: 'front' | 'back' = 'front';
    color: number = 0x000000;
    isTransparent: boolean = true;
};

export { VisualElement };