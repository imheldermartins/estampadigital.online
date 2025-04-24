import { parseHexColor } from "../shared";
import Mesh from "./Mesh";

abstract class MugModel extends Mesh {

    bodyColor: string = '#ffffff';
    handleColor: string = '#ffffff';
    innerColor: string = '#ffffff';

    get colors(): Array<number> {

        return [
            parseHexColor(this.bodyColor),
            parseHexColor(this.handleColor),
            parseHexColor(this.innerColor)
        ];
    }
}

export default MugModel;