import { useEffect, useState } from "react";
import Scene from "./shared";
import { useTheme } from "@/contexts/Theme";

interface SceneProps {
    mesh?: string;
    isActive?: boolean;
};

export const SceneIndex = ({ mesh, isActive }: SceneProps) => {

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

    useEffect(() => {

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            setSceneSize({
                width,
                height,
            });
        };

        if (isActive) {
            handleResize();
            window.addEventListener("resize", handleResize);
        }

        return () => {
            if (isActive) {
                window.removeEventListener("resize", handleResize);
            }
        };
    }, [isActive]);

    return (
        <Scene.Container theme={theme} width={sceneSize.width} height={sceneSize.height}>
            <Scene.Content
                width={sceneSize.width}
                height={sceneSize.height}
                mesh={`${mesh}`}
                theme={theme}
                setSize={setSize}
                isActive={isActive}
                typeMesh="dualColorMug"
            />
        </Scene.Container>
    );
}