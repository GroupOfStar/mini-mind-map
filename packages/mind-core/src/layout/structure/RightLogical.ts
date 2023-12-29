import { Layout } from "./Layout";
import { nonLayeredTidyTree2 } from "../algorithms";

export class RightLogical extends Layout {
  doLayout() {
    const rootNode = this.rootNode;
    return nonLayeredTidyTree2(rootNode, true);
  }
}
