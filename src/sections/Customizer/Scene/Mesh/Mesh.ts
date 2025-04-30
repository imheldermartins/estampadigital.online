import * as THREE from 'three';

import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VisualElement } from './VisualElement';

export interface IMesh {
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: THREE.Vector3;
    colors: Array<number>;
    groups: THREE.Group | null;
    materials: THREE.Material[] | null;
    texturedMaterials: (THREE.Material | THREE.MeshStandardMaterial)[];
    changeTexture(file: File, name?: string, onChangeTexture?: (visualElement: VisualElement[]) => void): VisualElement[] | void;
};

class Mesh implements IMesh {

    protected _position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    protected _rotation: THREE.Euler = new THREE.Euler(0, 0, 0);
    protected _scale: THREE.Vector3 = new THREE.Vector3(0.5, 0.5, 0.5);

    protected obj: GLTF | null = null;

    protected _colors: Array<number> = [];

    public visualElements: VisualElement[] = [];

    constructor(pos?: THREE.Vector3, rot?: THREE.Euler, scale?: THREE.Vector3) {

        this._position = pos || this._position;
        this._rotation = rot || this._rotation;
        this._scale = scale || this._position;
    }

    loadMesh(objPath: string, onLoaded: (gltf: GLTF) => void): GLTF | void {
        if (this.obj) return this.obj;

        {
            new GLTFLoader().load(objPath, (gltf) => {

                this.obj = gltf;

                gltf.scene.position.set(
                    this._position.x,
                    this._position.y,
                    this._position.z
                );
                gltf.scene.scale.set(
                    this._scale.x,
                    this._scale.y,
                    this._scale.z
                );
                gltf.scene.rotation.set(
                    this._rotation.x,
                    this._rotation.y + 1.5,
                    this._rotation.z
                );

                gltf.scene.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.castShadow = true;
                        child.receiveShadow = false; // geralmente os modelos não recebem sombra
                    }
                });

                onLoaded(gltf);

            }, (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded...\n');
            }, (error) => {
                console.log(`An error happened when run 'loadMesh': \n${error}\n`);
            }
            );
        }
    };

    get scale() {
        if (this.obj) {
            return this.obj.scene.scale;
        }
        return this._scale;
    }

    set scale(value: THREE.Vector3) {
        if (this.obj) {
            this.obj.scene.scale.set(value.x, value.y, value.z);
        }
    }

    get position() {

        if (this.obj) {
            return this.obj.scene.position;
        }
        return this._position;
    }

    set position(value: THREE.Vector3) {
        if (this.obj) {
            this.obj.scene.position.set(value.x, value.y, value.z);
        }
    }

    get rotation() {

        if (this.obj) {
            return this.obj.scene.rotation;
        }
        return this._rotation;
    }

    set rotation(value: THREE.Euler) {
        if (this.obj) {
            this.obj.scene.rotation.set(value.x, value.y, value.z);
        }
    }

    get colors(): Array<number> {

        if (this.obj) {
            this._colors = this.obj.scene.children.map((child) => {
                if (child instanceof THREE.Mesh) {
                    return child.material.color.getHex();
                }
                return 0;
            });
        }
        return this._colors;
    }

    get groups(): THREE.Group | null {

        const children = this.obj!.scene.children;

        if (!this.obj || children.length === 0) {
            throw new Error("Type 'obj' is undefined or no has any child element.");
            return null;
        }

        const group = children.find((child) => child.type === "Group") as THREE.Group;

        return group;
    }

    get materials(): THREE.Material[] | null {

        if (!this.groups && (this.groups ?? []).length === 0) return new Array<THREE.Material>();

        return (
            this.groups?.children
                .map(
                    child => (child as unknown as THREE.Mesh).material
                ) as THREE.Material[]
        );

    }

    get texturedMaterials(): (THREE.Material | THREE.MeshStandardMaterial)[] {

        if (!this.materials) return new Array<THREE.Material>();

        return this.materials.filter((mtl) => {
            if (
                mtl instanceof THREE.MeshStandardMaterial &&
                mtl.map instanceof THREE.Texture
            ) return mtl;

            return null;
        });
    }

    public changeTexture(file: File, name?: string, _?: (visualElement: VisualElement[]) => void): VisualElement[] | void {

        console.log(`File[${name || 'texture'}] loaded:\n`, file);
    }

}

export default Mesh;