import { useRef } from "react";

import { Icon } from "@iconify/react";
import { Button } from "./Button";

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
            <Button onClick={() => inputRef.current?.click()}>
                <Icon icon="mdi:image-outline" className="text-white mr-1" width={24} height={24} />

                <span className="text-white font-semibold text-sm md:text-base px-2">{title}</span>
            </Button>
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