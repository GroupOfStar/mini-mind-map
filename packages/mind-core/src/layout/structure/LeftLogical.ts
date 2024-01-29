import { Layout, nonLayeredTidyTree, WrapperdTree } from "./../core";
import { RootNode } from "./../../node";

export class LeftLogical extends Layout<RootNode> {
  get offset() {
    return {
      offsetX: (window.innerWidth * 2) / 3,
      offsetY: window.innerHeight / 2,
    };
  }
  doLayout() {
    const wt = nonLayeredTidyTree(this.rootNode, true, this.option);
    WrapperdTree.convertBack(wt, this.rootNode, this.option);
    const bb = this.getBoundingBox(this.rootNode);
    this.right2left(this.rootNode, bb);
    return this.rootNode;
  }
}
