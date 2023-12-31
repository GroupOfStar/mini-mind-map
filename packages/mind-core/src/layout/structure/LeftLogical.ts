import { Layout, nonLayeredTidyTree, WrapperdTree } from "./../core";
import { RootNode } from "./../../node";

export class LeftLogical extends Layout<RootNode> {
  doLayout() {
    const wt = nonLayeredTidyTree(this.rootNode, true);
    WrapperdTree.convertBack(wt, this.rootNode);
    const bb = this.getBoundingBox(this.rootNode);
    this.right2left(this.rootNode, bb);
    return this.rootNode;
  }
}
