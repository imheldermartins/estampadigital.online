// ImageEditor.tsx
import { useState, useEffect, useRef } from "react";
import * as fabric from "fabric";
import { ImagePicker } from './ImagePicker';
import { Button } from './Button';

interface ImageEditorProps {
    children?: React.ReactNode;
    preloadedUrl?: string;
    onExport?: (file: File) => void;
}

export const ImageEditor = ({ children, preloadedUrl, onExport }: ImageEditorProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

    const [open, setOpen] = useState<boolean>(false);
    const [isSelected, setIsSelected] = useState<boolean>(false);

    const removeSelectedObject = () => {
        if (!fabricCanvasRef.current) return;
        const canvas = fabricCanvasRef.current;
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.remove(activeObject);
            canvas.discardActiveObject();
            canvas.renderAll();
        }
    };

    const loadBackgroundImage = async (url: string, preload?: boolean) => {

        if (!fabricCanvasRef.current) return;
        const canvas = fabricCanvasRef.current;

        // console.log('[loadBackgroundImage] called with:', url);

        // Carrega a imagem de fundo
        try {
            // Carrega a imagem usando fabric.util.loadImage (Promise)
            const imgElement = await fabric.util.loadImage(url);

            const maxWidth = window.innerWidth * 0.8;
            const maxHeight = window.innerHeight * 0.8;
            const scale = Math.min(maxWidth / imgElement.width!, maxHeight / imgElement.height!, 1);

            const width = imgElement.width! * scale;
            const height = imgElement.height! * scale;

            // Cria um FabricImage a partir do elemento de imagem carregado
            const bgImage: fabric.FabricImage = new fabric.FabricImage(imgElement, {
                selectable: false,  // fundo não pode ser selecionado ou movido
                evented: false,      // ignora eventos de clique/seleção no fundo
                // left: width * scale / 2,
                // top: height * scale / 2,
                scaleX: preload ? -scale : scale,
                scaleY: scale,
                originX: 'left', // padrão
                originY: 'top',  // padrão
            });


            // Define o tamanho do canvas para o tamanho da imagem de fundo
            canvasRef.current!.width = width;
            canvasRef.current!.height = height;
            canvas.setDimensions({ width, height });

            // 🧹 Limpa fundo anterior (sem render imediata)
            canvas.backgroundImage = undefined;

            // 🖼️ Define a nova imagem de fundo
            canvas.backgroundImage = bgImage;

            canvas.requestRenderAll(); // redesenha o canvas com o novo fundo
            // (Boa prática: revogar URL blob para liberar memória)
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("[loadBackgroundImage] Erro:", err);
        }
    };

    const loadOverlayImage = async (url: string) => {

        if (!fabricCanvasRef.current) return;
        const canvas = fabricCanvasRef.current;

        try {
            const imgElement = await fabric.util.loadImage(url);
            const overlayImage = new fabric.FabricImage(imgElement);

            // Centraliza a imagem no canvas
            overlayImage.originX = 'center';
            overlayImage.originY = 'center';
            overlayImage.left = canvas.getWidth() / 2;
            overlayImage.top = canvas.getHeight() / 2;
            // Adiciona a imagem de sobreposição no canvas
            canvas.add(overlayImage);
            // Opcional: selecionar automaticamente a nova imagem para mostrar controles
            canvas.setActiveObject(overlayImage);
            canvas.renderAll();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Falha ao carregar imagem de sobreposição:", err);
        }
    };

    const handleBackgroundUpload = async (file: File) => {
        // Cria URL temporário para o arquivo selecionado
        const blobUrl = URL.createObjectURL(file);
        loadBackgroundImage(blobUrl);
    };

    const handleOverlayUpload = async (file: File) => {
        const blobUrl = URL.createObjectURL(file);
        loadOverlayImage(blobUrl);
    };

    const handleflip = (type: 'scaleX' | 'scaleY') => {
        const canvas = fabricCanvasRef.current!;

        // Inverte a imagem horizontalmente
        const active = canvas.getActiveObject();
        if (active && active instanceof fabric.FabricImage) {
            // Centralizar a origem para espelhar corretamente
            active.set({
                originX: 'center',
                originY: 'center',
                // scaleX: -active.scaleX!,
                // scaleY: -active.scaleY!,
                [type]: -active[type]!,

            });

            // Reposicionar no centro, se necessário
            active.set({
                left: canvas.getWidth() / 2,
                top: canvas.getHeight() / 2,
            });

            active.setCoords();
            canvas.requestRenderAll();
        }
    };

    const handleFlipHorizontal = () => {
        handleflip('scaleX');
    };

    const handleFlipVertical = () => {
        handleflip('scaleY');
    };

    const exportCanvasAsFile = () => {
        if (!fabricCanvasRef.current) return;

        handleFlipHorizontal();

        // Exporta como data URL (PNG)
        const dataUrl = fabricCanvasRef.current.toDataURL({
            format: 'png',
            quality: 1.0,
            multiplier: 1
        });

        // Converte para Blob
        fetch(dataUrl)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], 'canvas-export.png', { type: 'image/png' });
                onExport?.(file);
            });
    };


    useEffect(() => {
        if (open && canvasRef.current) {
            fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
                backgroundColor: '#fff',
                selection: true
            });
        }
        return () => {
            fabricCanvasRef.current?.dispose();
            fabricCanvasRef.current = null;
        };
    }, [open]);

    useEffect(() => {
        const canvas = fabricCanvasRef.current;
        if (canvas) {
            // Adiciona um evento de clique para selecionar objetos
            canvas.on('selection:created', () => {
                setIsSelected(true);
            });
            canvas.on('selection:cleared', () => {
                setIsSelected(false);
            });
        }
    }, []);

    useEffect(() => {
        // console.log('[ImageEditor] preloadedUrl mudou:', preloadedUrl);
        if (open && preloadedUrl && fabricCanvasRef.current) {
            loadBackgroundImage(preloadedUrl, true);
        }
    }, [preloadedUrl, open]);


    return open ? (
        <div className="fixed top-0 left-0 z-30 w-full h-full flex flex-col items-center justify-center gap-2 bg-[#00000099]">
            <div className="absolute top-0 right-0 p-2">
                <Button onClick={() => setOpen(!open)}>{!open ? "Abrir" : "Fechar"} Editor</Button>
            </div>
            <h1 className="text-2xl font-bold text-center">Edite sua estampa</h1>
            <canvas ref={canvasRef} />
            <div className=" p-3 rounded-lg border border-zinc-700 bg-zinc-900 flex flex-row gap-2 items-center justify-center shadow-lg">
                <ImagePicker title="Plano de fundo." onChange={handleBackgroundUpload} />
                <ImagePicker title="Adicionar uma imagem." onChange={handleOverlayUpload} />
                {isSelected && (
                    <>
                        <button onClick={handleFlipHorizontal} className="flex items-center justify-center cursor-pointer w-6 h-6 bg-indigo-500 text-xl">↩</button>
                        <button onClick={handleFlipVertical} className="flex items-center justify-center cursor-pointer w-6 h-6 bg-indigo-500 text-xl rotate-90">↪</button>
                        <button onClick={removeSelectedObject} className="flex items-center justify-center cursor-pointer w-6 h-6 bg-red-500 text-xl">🗑️</button>
                    </>
                )}
                <Button
                    className="!from-emerald-300 !to-emerald-600 !hover:from-emerald-400 !hover:to-emerald-700"
                    onClick={exportCanvasAsFile}
                >
                    Salvar Alterações
                </Button>
            </div>
        </div>
    ) : <Button onClick={() => setOpen(!open)} noStyle={!!children}>
        {!children ? (!open ? "Abrir" : "Fechar").concat(" Editor") : children}
    </Button>;
}
