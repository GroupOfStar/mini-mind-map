import { Layout, nonLayeredTidyTree, WrapperdTree } from "./../core";
import { RootNode } from "./../../node";

export class DownwardOrganizational extends Layout<RootNode> {
  doLayout() {
    const wt = nonLayeredTidyTree(this.rootNode, false, this.option);
    WrapperdTree.convertBack(wt, this.rootNode, this.option);
    return this.rootNode;
  }
}
