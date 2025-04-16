import { pallete, STATIC_COLORS } from "@/utils/pallete";
import clsx from "clsx";
import { useRef } from "react";

interface SceneContainerProps {
    children: React.ReactNode;
    width?: number;
    height?: number;
    theme: STATIC_COLORS;
};

export const SceneContainer = ({
    children,
    theme,
    width,
    height
}: SceneContainerProps) => {

    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef} className="relative flex-1 overflow-hidden">
            {children}
            <div className="absolute bottom-0 right-0 flex items-center gap-2">
                <div className={clsx("w-3 h-3 border border-gray-300 rounded-sm", pallete.bg[theme])} />
                <span className="px-1 py-0.5 text-sm font-medium text-gray-300">{`(${width}px - ${height}px)`}</span>
            </div>
        </div>
    );
}