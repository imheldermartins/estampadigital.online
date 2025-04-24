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
    if (color.startsWith("#")) {
        return parseInt(color.slice(1), 16);
    } else if (color.startsWith("0x")) {
        return parseInt(color.slice(2), 16);
    } else if (color.startsWith("rgb")) {
        const rgb = color.match(/\d+/g);
        if (rgb) {
            return (
                (parseInt(rgb[0]) << 16) |
                (parseInt(rgb[1]) << 8) |
                parseInt(rgb[2])
            );
        }
    }
    return 0xffffff; // Default to white if parsing fails
}


export {
    setThreeSizeScene,
    parseHexColor,
};