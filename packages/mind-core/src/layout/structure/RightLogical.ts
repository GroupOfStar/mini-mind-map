import { Layout } from "./Layout";
import { nonLayeredTidyTree } from "../algorithms";

export class RightLogical extends Layout {
  doLayout() {
    const rootNode = this.rootNode;
    return nonLayeredTidyTree(rootNode, true);
  }
}
