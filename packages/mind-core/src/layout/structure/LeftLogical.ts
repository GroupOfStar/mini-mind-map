import { Layout } from "./Layout";
import { nonLayeredTidyTree } from "../algorithms";

export class LeftLogical extends Layout {
  doLayout() {
    const rootNode = this.rootNode;
    nonLayeredTidyTree(rootNode, true);
    rootNode.right2left();
    return rootNode;
  }
}
