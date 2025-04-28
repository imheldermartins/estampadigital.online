import React from "react";

import * as THREE from "three";

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { parseHexColor, setThreeSizeScene } from "./shared";

import { ThreeScene } from "../shared";
import { STATIC_COLORS } from "@/utils/pallete";

import { SimpleMugMesh } from "./Mesh/Mug/SimpleMugMesh";

import FloorPlane from "./FloorPlane";
import Mesh from "./Mesh/Mesh";
// import { ImagePicker } from "@/components/ImagePicker";
import { VisualElement } from "./Mesh/VisualElement";
import { createVisualElementsFromMesh, imageBitmapToDataURL } from "./Mesh/utils";

interface SceneContentState {
    visualElements: VisualElement[];
}

interface SceneContentProps extends ThreeScene {
    setSize?: (width: number, height: number) => void;

    theme: STATIC_COLORS;
    isActive?: boolean;
};

export class SceneContent extends React.Component<SceneContentProps, SceneContentState> {

    /** Ref to the Three.js scene element. */
    private domEl: HTMLDivElement | null = null;

    private width: number = 0;
    private height: number = 0;

    private renderer: THREE.WebGLRenderer | null = null;
    private camera: THREE.PerspectiveCamera | null = null;
    private scene: THREE.Scene | null = null;

    private floorPlane: FloorPlane | null = null;

    private nodeIsLoaded: boolean = false;

    public mesh: Mesh | null = null;
    private meshPath: string = "/assets/3d/cup-3d.glb";

    public controls: OrbitControls | null = null;

    constructor(props: SceneContentProps) {
        super(props);

        this.scene = new THREE.Scene();
        this.state = {
            visualElements: [] as VisualElement[]
        };
    }

    private init() {

        this.camera = new THREE.PerspectiveCamera(100, this.width / this.height, 0.1, 10);

        // this.camera.position.set(0, 5, 0); // Caneca fica totalmente virada 90 graus
        this.camera.position.set(0, 1.5, 1.5);
        this.camera.lookAt(0, 1, 0);

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    private loadResources(): void {

        if (!this.scene) return;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        ambientLight.name = "ambientLight";
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.name = "directionalLight";
        directionalLight.position.set(-5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.bias = -0.001;
        directionalLight.shadow.mapSize.set(1024, 1024);
        this.scene.add(directionalLight);

        /**
         * Creates a floor plane with texture and without texture.
        */
        this.floorPlane = new FloorPlane(
            "/assets/floor.png", this.props.theme,
            (f1, f2) => {
                if (!this.scene || !f1 || !f2) return;

                this.scene.add(f1);
                this.scene.add(f2);
            }
        );

        this.mesh = new SimpleMugMesh(
            new THREE.Vector3(0, 0.01, 0),
            new THREE.Euler(0, 0, 0),
            new THREE.Vector3(0.5, 0.5, 0.5),
        ) as Mesh;
        this.mesh.loadMesh(this.meshPath, (gltf) => {
            if (!this.scene) return;

            this.scene.add(gltf.scene);
        });
    }

    // private handleCameraXRotation(): void {

    //     // Create eventListener to listen clientX only

    //     const handleMouseDown = (event: MouseEvent) => {
    //         if (!this.camera || !this.mesh) return;

    //         this.camProps.isDragging = true;
    //         this.camera.position.x = event.clientX / window.innerWidth * 2 - 1;
    //         this.camera.position.y = event.clientY / window.innerHeight * 2 - 1;
    //     };

    //     const handleMouseMove = (event: MouseEvent) => {

    //         // Not update Y coordinate, only X coordinate
    //         if (!this.camProps.isDragging || !this.camera || !this.mesh) return;

    //         const deltaX = event.clientX - this.camProps.lastXPos;
    //         this.camProps.lastXPos = event.clientX;
    //         this.camera.position.x += deltaX * 0.01; // Adjust the sensitivity as needed

    //         this.camera.position.x = Math.max(-1, Math.min(1, this.camera.position.x)); // Clamp the value between -1 and 1
    //     };

    //     const handleMouseUp = () => {
    //         this.camProps.isDragging = false;
    //     };

    //     window.addEventListener("mousedown", handleMouseDown);
    //     window.addEventListener("mousemove", handleMouseMove);
    //     window.addEventListener("mouseup", handleMouseUp);
    //     window.addEventListener("mouseleave", handleMouseUp);
    //     // window.addEventListener("touchmove", () => {}, false);
    // }

    private resize(width: number, height: number): void {

        if (!this.domEl || !this.renderer || !this.camera) return;

        if (width !== this.width || height !== this.height) {

            this.width = width;
            this.height = height;
        }

        setThreeSizeScene(this.domEl, (_width, _height) => {

            if (!this.renderer || !this.camera) return;

            this.width = _width;
            this.height = _height;

            this.props.setSize?.(_width, _height);
            this.renderer.setSize(_width, _height);

            this.camera.aspect = _width / _height;
            this.camera.updateProjectionMatrix();
        });
    }

    private animate(): void {

        requestAnimationFrame(this.animate.bind(this));

        if (this.mesh && !this.props.isActive)
            this.mesh.rotation.y += 0.001;
        else {

            if (!this.controls) {
                this.controls = new OrbitControls(this.camera!, this.domEl!);
                // this.camera!.position.z = 2;

                // this.controls.enableDamping = true;
                // this.controls.enableZoom = false;
                this.controls?.update();
            }
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    componentDidMount(): void {

        this.init();
        this.loadResources();
        this.resize(this.width, this.height);
    }

    componentDidUpdate(prevProps: Readonly<SceneContentProps>): void {

        // Create a observer class
        if (this.props.isActive !== prevProps.isActive) {

            this.resize(this.props.width, this.props.height);
            this.mesh!.rotation = new THREE.Euler(0, 1.5, 0);

            {
                const visualElements = createVisualElementsFromMesh(this.mesh!);
                console.log('visualElements: ', visualElements);

                this.setState({ visualElements });
            }
        }

        if (!this.nodeIsLoaded && this.domEl && this.renderer) {

            this.domEl?.appendChild(this.renderer.domElement);
            this.resize(this.props.width, this.props.height);
            this.nodeIsLoaded = true;
        }

        if (this.props.theme !== prevProps.theme) {

            if (!this.scene) return;

            // Change floor color
            const floorMtl = this.floorPlane?.getFloorPlane()?.material;

            if (floorMtl) {
                (floorMtl as THREE.MeshStandardMaterial).color.set(parseHexColor(this.props.theme));
            }
        }

        this.animate();
    }

    render() {
        return (
            <>
                <div
                    ref={(ref) => {
                        this.domEl = ref;
                    }}
                    className="w-full h-full"
                />
                {/* Se existir mesh e visualElements, renderiza cada VisualElement */}
                {this.state.visualElements && (
                    <div className="absolute top-0 right-0 p-4 flex flex-col gap-2">
                        {this.state.visualElements.map((element, index) => (
                            <div
                                key={index}
                                className="w-16 h-16 rounded-lg border border-gray-300 flex items-center justify-center text-xs text text-red-500"
                                style={{
                                    backgroundColor: `#${element.color.toString(16).padStart(6, '0')}`,
                                }}
                            >
                                {/* {element.position} */}
                                <img
                                    src={imageBitmapToDataURL(element.texture?.image as ImageBitmap)}
                                    alt="Texture preview"
                                    className="w-16 h-16"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
    }
}