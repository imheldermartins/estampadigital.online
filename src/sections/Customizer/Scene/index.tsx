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
};

export class SceneContent extends React.Component<SceneContentProps> {
    /** Ref to the Three.js scene element. */
    private domEl: HTMLDivElement | null = null;

    private renderer: THREE.WebGLRenderer | null = null;
    private camera: THREE.PerspectiveCamera | null = null;
    private scene: THREE.Scene | null = null;

    private floorPlane: FloorPlane | null = null;

    private width: number = 0;
    private height: number = 0;
    private mesh: string = "/assets/3d/cup-3d.glb";

    constructor(props: SceneContentProps) {
        super(props);

        this.scene = new THREE.Scene();
    }

    private load(width: number, height: number): void {
        if (!this.domEl || !this.scene) return;

        this.width = width;
        this.height = height;

        this.camera = new THREE.PerspectiveCamera(
            100,
            this.width / this.height,
            0.1,
            10
        );

        // this.camera.position.set(0, 5, 0); // Caneca fica totalmente virada 90 graus
        this.camera.position.set(0, 1.5, 1.5);
        this.camera.lookAt(0, 1, 0);

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.renderer.setSize(this.width, this.height);
        this.domEl.appendChild(this.renderer.domElement);

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

        const simpleMugMesh = new SimpleMugMesh(
            new THREE.Vector3(0, 0, 0),
        );
        simpleMugMesh.loadMesh(this.mesh, (gltf) => {
            this.scene?.add(gltf.scene);
        });

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

        this.animate();
    }

    private animate(): void {
        requestAnimationFrame(this.animate.bind(this));

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    componentDidMount(): void {
        if (!this.domEl) return;

        setThreeSizeScene(this.domEl, this.props.setSize);
    }

    componentDidUpdate(prevProps: Readonly<SceneContentProps>): void {
        if (
            (this.props.width !== prevProps.width || this.props.height !== prevProps.height) &&
            this.props.width > 0 &&
            this.props.height > 0 &&
            !this.renderer
        ) {
            this.load(this.props.width, this.props.height);
        }

        if (this.props.theme !== prevProps.theme) {

            if (!this.scene) return;

            // Change floor color
            const floorMtl = this.floorPlane?.getFloorPlane()?.material;

            if (floorMtl) {
                (floorMtl as THREE.MeshStandardMaterial).color.set(parseHexColor(this.props.theme));
            }
        }

        // if (this.props.theme !== prevProps.theme) {

        //     const newColor = parseHexColor(this.props.theme);

        //     if (this.scene) {
        //         const ambientLight = this.scene.getObjectByName("ambientLight") as THREE.AmbientLight;
        //         if (ambientLight) {
        //             ambientLight.color.set(newColor);  // Atualiza a cor da luz ambiente
        //         }

        //         const directionalLight = this.scene.getObjectByName("directionalLight") as THREE.DirectionalLight;
        //         if (directionalLight) {
        //             directionalLight.color.set(newColor);  // Atualiza a cor da luz direcional
        //         }

        //         const floor = this.scene.getObjectByName("floor") as THREE.Mesh;
        //         if (floor) {
        //             (floor.material as THREE.MeshStandardMaterial).color.set(newColor);  // Atualiza a cor do chão
        //         }
        //     }
        // }

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