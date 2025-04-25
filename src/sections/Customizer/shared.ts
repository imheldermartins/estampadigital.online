import { SceneContainer } from "./Container";
import { SceneContent } from "./Scene/index";
import { SceneIndex } from "./Default";

export default {
    Root: SceneIndex,
    Container: SceneContainer,
    Content: SceneContent,
};

export type ThreeScene = {
    mesh: string;
    width: number;
    height: number;
};

export const Scene = SceneIndex;