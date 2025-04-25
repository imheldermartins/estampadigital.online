import React from "react";

import * as THREE from "three";

import { parseHexColor, setThreeSizeScene } from "./shared";
import { ThreeScene } from "../shared";
import { SimpleMugMesh } from "./Mesh/Mug/SimpleMugMesh";
import { STATIC_COLORS } from "@/utils/pallete";
import FloorPlane from "./FloorPlane";

interface SceneContentProps extends ThreeScene {
    setSize?: (width: number, height: number) => void;

    theme: STATIC_COLORS;
    isActive?: boolean;
};

export class SceneContent extends React.Component<SceneContentProps> {

    /** Ref to the Three.js scene element. */
    private domEl: HTMLDivElement | null = null;

    private width: number = 0;
    private height: number = 0;
    private mesh: string = "/assets/3d/cup-3d.glb";

    private renderer: THREE.WebGLRenderer | null = null;
    private camera: THREE.PerspectiveCamera | null = null;
    private scene: THREE.Scene | null = null;

    private floorPlane: FloorPlane | null = null;


    private nodeIsLoaded: boolean = false;

    constructor(props: SceneContentProps) {
        super(props);

        this.scene = new THREE.Scene();
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

        const simpleMugMesh = new SimpleMugMesh(
            new THREE.Vector3(0, 0, 0),
        );
        simpleMugMesh.loadMesh(this.mesh, (gltf) => {
            if (!this.scene) return;

            this.scene.add(gltf.scene);
        });
    }

    private resize(): void {

        if (!this.domEl || !this.renderer || !this.camera) return;

        setThreeSizeScene(this.domEl, (width, height) => {

            this.props.setSize?.(width, height);
            this.renderer!.setSize(this.width, this.height);
            this.width = width;
            this.height = height;
        });


        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    private animate(): void {

        requestAnimationFrame(this.animate.bind(this));

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }


    componentDidMount(): void {

        this.init();
        this.loadResources();
        this.resize();
    }

    componentDidUpdate(prevProps: Readonly<SceneContentProps>): void {

        if (prevProps.isActive) {
            this.resize();
        }

        if (!this.nodeIsLoaded && this.domEl && this.renderer) {

            this.domEl?.appendChild(this.renderer.domElement);
            this.resize();
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
            <div
                ref={(ref) => {
                    this.domEl = ref;
                }}
                className="w-full h-full"
            />
        );
    }
}