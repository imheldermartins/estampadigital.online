import { useRef } from "react";

import { Icon } from "@iconify/react";

interface ImagePickerProps {
    title?: string;
    onChange?: (file: File) => void;
};

export const ImagePicker = ({ title = 'Faça o upload de uma imagem.', onChange }: ImagePickerProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && onChange) {
            onChange(file);
        }
    };

    return (
        <>
            <button
                className="px-3 py-1.5 md:py-2 cursor-pointer flex items-center justify-center rounded-lg bg-gradient-to-bl from-indigo-300 to-indigo-600 hover:from-indigo-400 hover:to-indigo-700 transition-all duration-200 ease-in-out"
                onClick={() => inputRef.current?.click()}
            >
                <Icon icon="mdi:image-outline" className="text-white" width={24} height={24} />

                <span className="text-white font-semibold text-sm md:text-base px-2">{title}</span>
            </button>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                hidden
            />
        </>
    )
}