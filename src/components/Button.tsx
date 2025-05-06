import clsx from "clsx";
import { ComponentPropsWithoutRef } from "react";

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
    noStyle?: boolean;
};

export const Button = ({ className, noStyle = false, ...props }: ButtonProps) => {

    return (
        <button
            className={clsx(
                { "w-fit h-fit px-3 py-2 font-semibold flex items-center justify-center cursor-pointer rounded-lg bg-gradient-to-bl from-indigo-300 to-indigo-600 hover:from-indigo-400 hover:to-indigo-700 transition-all duration-200 ease-in-out": !noStyle },
                className)
            }
            {...props}
        />
    )
}