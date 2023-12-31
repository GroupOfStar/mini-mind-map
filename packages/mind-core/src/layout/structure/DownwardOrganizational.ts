import { Layout, nonLayeredTidyTree, WrapperdTree } from "./../core";
import { RootNode } from "./../../node";

export class DownwardOrganizational extends Layout<RootNode> {
  doLayout() {
    const wt = nonLayeredTidyTree(this.rootNode, false);
    WrapperdTree.convertBack(wt, this.rootNode);
    return this.rootNode;
  }
}
