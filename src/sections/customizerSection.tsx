"use client";

import clsx from "clsx";

import { Headline } from '@/components/Headline';
import { Scene } from "@/components/Scene";

import { useTheme } from "@/contexts/Theme";
import { pallete } from "@/utils/pallete";

interface CustomizerSectionProps {
    mesh?: string;
};

export const CustomizerSection = (props: CustomizerSectionProps) => {
    const { theme } = useTheme();

    return (
        <>
            <main className={clsx('min-w-screen h-[calc(100vh-10vh)] flex', pallete.bg[theme])}>
                <div className='flex items-center p-1'>
                    <Headline />
                </div>
                <Scene {...props} />
            </main>
            <footer className={clsx("w-full h-[10vh] py-2 text-center flex flex-row gap-2 items-center justify-center", pallete.bg[theme])}>
                <h3 className="font-bold">EstampaDigital.online</h3>
                <span>{" | "}</span>
                <p>Site feito por{" "}
                    <a href="http://heldermartins.vercel.app" target="_blank" rel="noopener noreferrer" className='font-semibold underline underline-offset-4'>
                        Helder Martins
                    </a>
                    {" "}© {new Date().getFullYear()}</p>
            </footer>
        </>
    )
}