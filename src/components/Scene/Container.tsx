import { STATIC_COLORS } from "@/src/utils/pallete";

interface SceneContainerProps {
    children: React.ReactNode;
    theme?: STATIC_COLORS;
};

export const SceneContainer = ({
    children,
    theme
}: SceneContainerProps) => {
    return (
        <section className="flex-1">{children}</section>
    )
}