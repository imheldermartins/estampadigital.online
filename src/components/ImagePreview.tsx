import { imageBitmapToDataURL, imageBitmapToFile } from "@/sections/Customizer/Scene/Mesh/utils";
import { VisualElement } from "@/sections/Customizer/Scene/Mesh/VisualElement";
import { ImagePicker } from "./ImagePicker";
import { ImageEditor } from './ImageEditor';
import { useEffect, useRef, useState } from "react";

interface ImagePreviewProps {
    visualElements: VisualElement[];
    onChange: (file: File, id: string) => void;
};

const Preview = (
    { children, image, id, onChange }: {
        children: React.ReactNode;
        image: ImageBitmap
        id: string;
        onChange: (file: File, id: string) => void;
    }) => {

    const previousUrlRef = useRef<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadImage() {
            try {
                const file = await imageBitmapToFile(image);
                // const blobUrl = URL.createObjectURL(file);

                const newBlob = new Blob([file.slice(0)], { type: file.type });
                const blobUrl = `${URL.createObjectURL(newBlob)}#${Date.now()}`;


                if (isMounted) {
                    // Revoga o anterior, se existir
                    if (previousUrlRef.current) {
                        URL.revokeObjectURL(previousUrlRef.current);
                    }

                    previousUrlRef.current = blobUrl;
                    setImageUrl(blobUrl);
                }
            } catch (error) {
                console.error("Erro ao carregar imagem:", error);
            }
        };

        loadImage();

        return () => {
            isMounted = false;
            if (previousUrlRef.current) {
                URL.revokeObjectURL(previousUrlRef.current);
                previousUrlRef.current = null;
            }
        };
    }, [image]);

    return (
        <ImageEditor
            {...(imageUrl ? { preloadedUrl: imageUrl } : {})}
            onExport={(file) => {
                onChange(file, id);
            }}
        >
            {children}
        </ImageEditor>
    )
}

export const ImagePreview = ({ visualElements, onChange }: ImagePreviewProps) => (
    <div className="absolute top-0 right-0 p-4 flex flex-col gap-2">
        {visualElements.map((element, index) => (
            <div key={index} className="flex flex-col items-end gap-2">
                <Preview
                    key={`${index}-${element.id}`}
                    image={element.texture?.image as ImageBitmap}
                    id={element.id}
                    onChange={onChange}
                >
                    <div
                        className="w-48 h-18 rounded-lg border border-indigo-500 flex items-center justify-center text-xs cursor-pointer"
                        style={{
                            backgroundColor: `#${element.color.toString(16).padStart(6, '0')}`,
                        }}
                    >
                        <img
                            src={imageBitmapToDataURL(element.texture?.image as ImageBitmap)}
                            alt="Texture preview"
                            className="max-w-full max-h-full flex-1 transform -scale-x-100 saturate-50 hover:saturate-100"
                        />
                    </div>
                </Preview>
                <ImagePicker title={`Mudar ${element.id}`} onChange={(file) => {
                    onChange(file, element.id);
                }} />
            </div>
        ))}
    </div>
);