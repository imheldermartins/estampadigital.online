import { PageRoute } from '@/types/PageRoute';
import { CustomizerSection } from '@/sections/Customizer';

interface MeshPageProps extends PageRoute<{
    mesh: string;
}> { };

export default function MeshPage({
    params: { mesh }
}: MeshPageProps) {
    return <CustomizerSection mesh={mesh} />
}