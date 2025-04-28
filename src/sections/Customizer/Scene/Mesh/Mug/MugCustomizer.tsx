import { ImagePicker } from "@/components/ImagePicker"

interface MugCustomizerProps {
    items: {
        imgPicker: typeof ImagePicker[];
    };
};

export const MugCustomizer = ({ items }: MugCustomizerProps) => {
    const cmpList = Object.keys(items) as Array<keyof MugCustomizerProps["items"]>;
    return (
        <div className="absolute top-0 left-0 w-full h-[10vh] py-2 text-center flex flex-row gap-2 items-center justify-center z-10">
            {cmpList.map(item => {

                if (!(items[item] instanceof ImagePicker)) return null

                items[item].map((Component, key) => (
                    <Component key={key} />
                ))
            })}
        </div>
    )
}