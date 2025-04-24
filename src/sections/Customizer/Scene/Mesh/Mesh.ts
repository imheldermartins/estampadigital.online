import * as THREE from 'three';

import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VisualElement } from './VisualElement';


class Mesh {

    protected obj: GLTF | null = null;
    protected visualElements: VisualElement[] = [];
    protected _colors: Array<number> = [];

    get scale() {
        if (this.obj) {
            return this.obj.scene.scale;
        }
        return new THREE.Vector3(0, 0, 0);
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
        return new THREE.Vector3(0, 0, 0);
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
        return new THREE.Euler(0, 0, 0);
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

                gltf.scene.position.set(0, 0, 0);
                gltf.scene.scale.set(0, 0, 0);
                gltf.scene.rotation.set(0, 0, 0);

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