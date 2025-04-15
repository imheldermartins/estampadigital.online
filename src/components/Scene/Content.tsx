import React, { useEffect, useRef } from "react";

import * as THREE from "three";

import { ThreeScene } from ".";

import setThreeSizeScene from "./shared";

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
    private mesh: string = "";

    private cube: THREE.Mesh | null = null;

    constructor(props: SceneContentProps) {
        super(props);

        this.scene = new THREE.Scene();
        // this.camera = new Three.PerspectiveCamera(75, 1, 0.1, 1000);
        // this.renderer = new Three.WebGLRenderer({ alpha: true });
    }

    load(): void {
        if (!this.domEl || !this.scene) return;

        this.width = this.props.width;
        this.height = this.props.height;

        this.camera = new THREE.PerspectiveCamera(
            75,
            this.width / this.height,
            0.1,
            1000
        );

        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.width, this.height);
        this.domEl.appendChild(this.renderer.domElement);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);

        this.animate();
    }

    animate(): void {
        requestAnimationFrame(this.animate.bind(this));

        if (this.cube) {
            this.cube.rotation.x += 0.01;
            this.cube.rotation.y += 0.01;
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    componentDidMount(): void {
        if (!this.domEl) return;

        setThreeSizeScene(this.domEl, this.props.setSize);

        this.load();
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