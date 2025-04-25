import { useState } from "react";
import Scene from "./shared";
import { useTheme } from "@/contexts/Theme";

interface SceneProps {
    mesh?: string;
    width?: number;
    height?: number;
};

export const SceneIndex = ({ mesh }: SceneProps) => {

    const { theme } = useTheme();

    const [sceneSize, setSceneSize] = useState({
        width: 0,
        height: 0
    });

    const setSize = (width: number, height: number) => {
        setSceneSize({
            width,
            height,
        });
    };

    return (
        <Scene.Container theme={theme} width={sceneSize.width} height={sceneSize.height}>
            <Scene.Content
                width={sceneSize.width}
                height={sceneSize.height}
                mesh={`${mesh}`}
                theme={theme}
                setSize={setSize}
            />
        </Scene.Container>
    );
}