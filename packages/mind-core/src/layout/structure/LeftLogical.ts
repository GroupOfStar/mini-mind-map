import { Layout } from "./Layout";
import { nonLayeredTidyTree } from "../algorithms";
import { WrapperdTree } from "../hierarchy";

export class LeftLogical extends Layout {
  doLayout() {
    this.layer(this.nodeTree, this.options, true);
    const wt = new WrapperdTree(this.nodeTree, this.options, true);
    nonLayeredTidyTree(this.nodeTree, wt, true);
    this.nodeTree.right2left();

    return this.rootNode;
  }
}
