import * as THREE from 'three';

import { parseHexColor } from './shared';

import { STATIC_COLORS } from '@/utils/pallete';

type EssentialPlaneProps = {
    width?: number;
    height?: number;
};

class FloorPlane {

    private texturedPlane: THREE.Mesh | null = null;
    private mtlPlane: THREE.Mesh | null = null;

    constructor(texturePath: string, theme: STATIC_COLORS, onLoaded: (f1: THREE.Mesh, f2: THREE.Mesh) => void, name?: string) {

        name = name || 'floor';
        /**
         * * Create Floor without Texture
         */
        this.mtlPlane = this.loadFloor(
            theme,
            null,
            false,
        );
        /**
         * * Create Floor with Texture
         */
        const textureLoader = new THREE.TextureLoader();
        const floorTexture = textureLoader.load(texturePath);

        this.texturedPlane = this.loadFloor(
            0xffffff,
            floorTexture,
            true,
        );

        this.setFloorProps(this.mtlPlane, 0, `${name?.concat('.mtl')}`);
        this.setFloorProps(this.texturedPlane, 0.01, `${name?.concat('.tex0')}`);

        onLoaded(this.mtlPlane, this.texturedPlane);
    }

    public getFloorPlane(): THREE.Mesh | null {
        return this.mtlPlane;
    }

    public getTexturedPlane(): THREE.Mesh | null {
        return this.texturedPlane;
    }

    private setFloorProps(floor: THREE.Mesh, y?: number, name?: string) {

        floor.rotation.x = -Math.PI / 2;
        floor.position.y = y || 0;
        floor.receiveShadow = true;
        floor.castShadow = true;

        floor.name = name || 'floor';
    }

    private loadFloor(
        theme: STATIC_COLORS | number,
        texture?: THREE.Texture | null,
        transparent?: boolean,
        size?: EssentialPlaneProps,
    ): THREE.Mesh {

        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(size?.width || 5, size?.height || 5),
            new THREE.MeshStandardMaterial({
                map: texture,
                color: typeof theme === 'string' ? parseHexColor(theme) : theme,
                roughness: 0.8,
                metalness: 0.1,
                transparent,
                // alphaTest: 0.5,
                // depthWrite: false,
            }));

        return floor;
    }
}

export default FloorPlane;