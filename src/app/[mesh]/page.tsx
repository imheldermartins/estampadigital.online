import { CustomizerSection } from '../../sections/customizerSection';

interface MeshPageProps {
    params: {
        mesh: string;
    }
};

export default function MeshPage({ params: { mesh } }: MeshPageProps) {
    return (
        <div className="flex flex-col font-[family-name:var(--font-noto-sans)]">
            <CustomizerSection mesh={mesh} />
        </div>
    );
}