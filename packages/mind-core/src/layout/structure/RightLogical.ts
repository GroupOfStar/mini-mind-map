import { Layout, nonLayeredTidyTree, WrapperdTree } from "./../core";
import { RootNode } from "./../../node";

export class RightLogical extends Layout<RootNode> {
  get offset() {
    return {
      offsetX: window.innerWidth / 3,
      offsetY: window.innerHeight / 2,
    };
  }
  doLayout() {
    const wt = nonLayeredTidyTree(this.rootNode, true, this.option);
    WrapperdTree.convertBack(wt, this.rootNode, this.option);
    return this.rootNode;
  }
}
