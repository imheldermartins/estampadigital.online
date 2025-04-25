import { useTheme } from "@/contexts/Theme";
import { pallete, STATIC_COLORS } from "@/utils/pallete";
import clsx from "clsx";

export const ThemePicker = () => {

    const { theme, setTheme } = useTheme();
    const colors = Object.keys(pallete.bg) as STATIC_COLORS[];

    return (
        <div className="absolute bottom-[5vh] left-1/2 -translate-x-1/2 z-10 bg-zinc-900 rounded-lg shadow-xl shadow-zinc-900 flex flex-row gap-2 p-3 group/item">
            {colors.map((color, index) => (
                <div key={index} className="relative w-8 h-8">
                    <button
                        key={color}
                        className={clsx(
                            "absolute w-8 h-8 rounded-full cursor-pointer border-2 border-zinc-900 transition-transform ease-in-out duration-150 transform hover:-translate-y-2 hover:scale-150 group-hover/item:scale-105",
                            pallete.bg[color],
                            { "ring ring-white ring-offset-2": theme === color }
                        )}
                        onClick={() => {
                            if (theme !== color)
                                setTheme(color)
                        }}
                    />
                </div>
            ))}
        </div>

    );
}