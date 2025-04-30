// import { PageRoute } from '@/types/PageRoute';
import { CustomizerSection } from '@/sections/Customizer';

// type MeshPageProps = PageRoute<{
//     mesh: string;
// }>;

export default async function MeshPage({
    params
}: {
    params: Promise<{ mesh: string }>
}) {

    const { mesh } = await params;

    return <CustomizerSection mesh={mesh} />
}