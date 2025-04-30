import * as THREE from 'three';

type ConstructorParams = {
    id?: string;
    texture?: THREE.Texture | null;
    size?: number;
    position?: 'front' | 'back';
    color?: number;
    isTransparent?: boolean;
};

class VisualElement {

    public id: string = crypto.randomUUID();
    public texture: THREE.Texture | null = null;
    public size: number = 0;
    public position: 'front' | 'back' = 'front';
    public color: number = 0x000000;
    public isTransparent: boolean = true;

    constructor({ position = 'front', size = 0, ...props }: Partial<ConstructorParams>) {
        this.id = props.id || this.id;
        this.size = size;
        this.position = position;
        this.texture = props.texture || this.texture;
        this.color = props.color || this.color;
        this.isTransparent = props.isTransparent || this.isTransparent;
    }
};

export { VisualElement };