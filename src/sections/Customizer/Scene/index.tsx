import React from "react";

import * as THREE from "three";

import { setThreeSizeScene } from "./shared";
import { ThreeScene } from "../shared";
import { SimpleMugMesh } from "./Mesh/Mug/SimpleMugMesh";

interface SceneContentProps extends ThreeScene {
    setSize?: (width: number, height: number) => void;
};

export class SceneContent extends React.Component<SceneContentProps> {
    /** Ref to the Three.js scene element. */
    private domEl: HTMLDivElement | null = null;

    private renderer: THREE.WebGLRenderer | null = null;
    private camera: THREE.PerspectiveCamera | null = null;
    private scene: THREE.Scene | null = null;

    private width: number = 0;
    private height: number = 0;
    private mesh: string = "/assets/3d/cup-3d.glb";

    constructor(props: SceneContentProps) {
        super(props);

        this.scene = new THREE.Scene();
    }

    load(): void {
        if (!this.domEl || !this.scene) return;

        this.width = this.props.width;
        this.height = this.props.height;

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
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
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

        // Creates Floor
        const textureLoader = new THREE.TextureLoader();
        const floorTexture = textureLoader.load("/assets/floor.png");
        const floorGeometry = new THREE.PlaneGeometry(5, 5);
        const floorMaterial = new THREE.MeshStandardMaterial({
            map: floorTexture,
            color: 0xffffff,
            roughness: 0.8,
            metalness: 0.1,
            blending: THREE.AdditiveBlending,
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);

        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0;
        floor.receiveShadow = true;

        this.scene.add(floor);

        this.animate();
    }

    animate(): void {
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
            this.load();
        }
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