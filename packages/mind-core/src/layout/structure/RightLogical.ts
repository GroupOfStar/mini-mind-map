import { Layout, nonLayeredTidyTree, WrapperdTree } from "./../core";
import { RootNode } from "./../../node";

export class RightLogical extends Layout<RootNode> {
  doLayout() {
    const wt = nonLayeredTidyTree(this.rootNode, true);
    WrapperdTree.convertBack(wt, this.rootNode);
    return this.rootNode;
  }
}
