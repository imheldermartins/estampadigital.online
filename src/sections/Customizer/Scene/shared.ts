import { pallete } from "@/utils/pallete";

function setThreeSizeScene(
    el: HTMLDivElement | null,
    setSize?: (width: number, height: number) => void
) {
    if (!el) return;

    const measure = () => {
        const rect = el.getBoundingClientRect();

        setSize?.(
            Math.ceil(rect.width),
            Math.ceil(rect.height)
        );
    };

    requestAnimationFrame(measure);
}

function parseHexColor(color: string): number {
    const hexColor = pallete.hex[color as keyof typeof pallete.hex] || color;

    return parseInt(hexColor.replace("#", ""), 16);
}


export {
    setThreeSizeScene,
    parseHexColor,
};