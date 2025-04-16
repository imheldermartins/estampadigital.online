import { STATIC_COLORS } from "@/utils/pallete";

import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

namespace Mesh {

    export type Axis = 'x' | 'y' | 'z';
    export type AxisValue = { [key in Axis]: number };

    export const AxisInitializerValue: AxisValue = { x: 0, y: 0, z: 0 };

    export interface IMesh {

        position: AxisValue;
        rotation: AxisValue;
        scale: AxisValue;

        color: STATIC_COLORS;

        materialPath: string;
        texturePath: string;

        obj: GLTF | null;

        loadMesh: (objPath: string, onLoaded: (gltf: GLTF) => void) => void;
    };

    export class Mesh implements IMesh {

        private _position: AxisValue = AxisInitializerValue;
        private _rotation: AxisValue = AxisInitializerValue;
        private _scale: AxisValue = AxisInitializerValue;

        private _color: STATIC_COLORS = "black";

        private _materialPath: string = "";
        private _texturePath: string = "";

        private _obj: GLTF | null = null;

        constructor() {

            this._position = AxisInitializerValue;
            this._rotation = AxisInitializerValue;
            this._scale = { x: 0.5, y: 0.5, z: 0.5 };

            this._color = 'black';

            this._materialPath = '';
            this._texturePath = '';
        }

        loadMesh(objPath: string, onLoaded: (gltf: GLTF) => void) {
            if (this.obj) return this.obj;

            {
                new GLTFLoader().load(objPath, (gltf) => {

                    this.obj = gltf; // load object

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
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                }, (error) => {
                    console.log(`An error happened when run 'loadMesh': \n${error}\n`);
                }
                );
            }
        };

        public get obj(): GLTF | null {
            return this._obj;
        }

        public set obj(value: GLTF) {
            this._obj = value;
        }

        public get position(): AxisValue {
            return this._position;
        }

        public set position(value: AxisValue) {
            this._position = value;

            if (this.obj) {
                // set position of the object

            }
        }

        public get rotation(): AxisValue {
            return this._rotation;
        }

        public set rotation(value: AxisValue) {
            this._rotation = value;
        }

        public get scale(): AxisValue {
            return this._scale;
        }

        public set scale(value: AxisValue) {
            this._scale = value;
        }

        public get color(): STATIC_COLORS {
            return this._color;
        }

        public set color(value: STATIC_COLORS) {
            this._color = value;
        }

        public get materialPath(): string {
            return this._materialPath;
        }

        public set materialPath(value: string) {
            this._materialPath = value;
        }

        public get texturePath(): string {
            return this._texturePath;
        }

        public set texturePath(value: string) {
            this._texturePath = value;
        }
    }
}

export default Mesh;