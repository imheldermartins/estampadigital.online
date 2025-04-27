import * as THREE from 'three';

import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VisualElement } from './VisualElement';

class Mesh {

    protected _position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    protected _rotation: THREE.Euler = new THREE.Euler(0, 0, 0);
    protected _scale: THREE.Vector3 = new THREE.Vector3(0.5, 0.5, 0.5);

    protected obj: GLTF | null = null;
    protected visualElements: VisualElement[] = [];
    protected _colors: Array<number> = [];

    constructor(pos?: THREE.Vector3, rot?: THREE.Euler, scale?: THREE.Vector3) {

        this._position = pos || this._position;
        this._rotation = rot || this._rotation;
        this._scale = scale || this._position;
    }

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
}

export default Mesh;