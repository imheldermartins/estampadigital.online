"use client";

import clsx from "clsx";

import { Headline } from '@/components/Headline';
import { Scene } from "@/sections/Customizer/shared";

import { useTheme } from "@/contexts/Theme";
import { pallete } from "@/utils/pallete";
import { ThemePicker } from "@/components/ThemePicker";
import { StartBackdrop } from "@/components/StartBackdrop";
import { useState } from "react";

interface CustomizerSectionProps {
    mesh?: string;
};

export const CustomizerSection = (props: CustomizerSectionProps) => {
    const { theme } = useTheme();

    const [isActive, setIsActive] = useState<boolean>(false);

    return (
        <div className={clsx('w-screen h-screen flex flex-col', pallete.bg[theme])}>

            <ThemePicker />

            <main className="flex flex-1 flex-row justify-center relative">
                <StartBackdrop
                    isActive={!isActive}
                    setIsActive={() => setIsActive(true)}
                />

                <Scene {...props} />
            </main>

            {!isActive && (
                <footer className="w-full h-[10vh] py-2 text-center flex flex-row gap-2 items-center justify-center">
                    <h3 className="font-bold underline underline-offset-4">EstampaDigital.online</h3>
                    <span>{" | "}</span>
                    <p>Site feito por{" "}
                        <a href="http://heldermartins.vercel.app" target="_blank" rel="noopener noreferrer" className='font-semibold bg-black px-1 py-0.5'>
                            Helder Martins
                        </a>
                        {" "}© {new Date().getFullYear()}</p>
                </footer>
            )}
        </div>
    )
}