import { Layout, nonLayeredTidyTree, WrapperdTree } from "./../core";
import { RootNode } from "./../../node";

export class DownwardOrganizational extends Layout<RootNode> {
  get offset() {
    return {
      offsetX: window.innerWidth / 2,
      offsetY: window.innerHeight / 3,
    };
  }
  doLayout() {
    const wt = nonLayeredTidyTree(this.rootNode, false, this.option);
    WrapperdTree.convertBack(wt, this.rootNode, this.option);
    return this.rootNode;
  }
}
