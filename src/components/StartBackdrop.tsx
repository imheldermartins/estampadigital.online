import { useTheme } from "@/contexts/Theme";
import { Headline } from "./Headline";
import clsx from "clsx";
import { pallete } from "@/utils/pallete";

interface StartBackdropProps {
    isActive?: boolean;
    setIsActive?: (isActive: boolean) => void;
};

export const StartBackdrop = ({ isActive = true, setIsActive }: StartBackdropProps) => {
    const { theme } = useTheme();

    return (
        <div className={clsx('bg-[rgba(0,0,0,0.5)] absolute w-full h-full flex flex-col justify-center items-start p-1 z-10', {
            'hidden': !isActive,
        })}>
            <Headline />
            <button
                className={clsx("w-[300px] px-6 py-4 text-xl font-bold rounded-lg bg-white mt-8 cursor-pointer hover:ring-2 hover:w-[calc(300px - 4px)] hover:bg-transparent hover:!text-white hover:border-white border-2 transition-all duration-200 ease-in-out",
                    pallete.text[theme]
                )}
                onClick={() => setIsActive?.(false)}
            >
                ▷{" "}Iniciar customização
            </button>
        </div>
    )
};