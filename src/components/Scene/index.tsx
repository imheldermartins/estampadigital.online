import { SceneContainer } from "./Container";

const Root = {
    Container: SceneContainer,
};

interface SceneProps {
    mesh?: string;
};

export const Scene = (props: SceneProps) => {
    return (
        <Root.Container>
            {props.mesh}
        </Root.Container>
    );
}