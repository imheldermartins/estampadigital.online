import * as THREE from 'three';

type ConstructorParams = {
    texture?: THREE.Texture | null;
    size?: number;
    position?: 'front' | 'back';
    color?: number;
    isTransparent?: boolean;
};

class VisualElement {

    public texture: THREE.Texture | null = null;
    public size: number = 0;
    public position: 'front' | 'back' = 'front';
    public color: number = 0x000000;
    public isTransparent: boolean = true;

    constructor({ position = 'front', size = 0, ...props }: Partial<ConstructorParams>) {
        this.size = size;
        this.position = position;
        this.texture = props.texture || new THREE.Texture();
        this.color = props.color || 0;
        this.isTransparent = props.isTransparent || true;
    }
};

export { VisualElement };