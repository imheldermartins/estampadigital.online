export default function setThreeSizeScene(
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