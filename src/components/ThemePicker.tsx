import { useTheme } from "@/contexts/Theme";
import { pallete, STATIC_COLORS } from "@/utils/pallete";
import clsx from "clsx";

export const ThemePicker = () => {

    const { theme, setTheme } = useTheme();
    const colors = Object.keys(pallete.bg) as STATIC_COLORS[];

    return (
        <div className="absolute top-1/2 right-[2vw] -translate-y-1/2 z-10 bg-zinc-900 rounded-lg shadow-xl shadow-zinc-900 flex flex-col gap-2 p-3">
            {colors.map((color) => (
                <button
                    key={color}
                    className={clsx(
                        "w-8 h-8 rounded-full cursor-pointer border-2 border-zinc-900 hover:scale-150 hover:my-2 ease-in-out duration-200",
                        pallete.bg[color],
                        { "ring ring-white ring-offset-2 my-1": theme === color },
                    )}
                    onClick={() => {
                        if (theme !== color)
                            setTheme(color)
                    }}
                />
            ))}
        </div>
    );
}