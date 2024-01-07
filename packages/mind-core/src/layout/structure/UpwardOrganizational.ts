import { Layout, nonLayeredTidyTree, WrapperdTree } from "./../core";
import { RootNode } from "./../../node";

export class UpwardOrganizational extends Layout<RootNode> {
  doLayout() {
    const wt = nonLayeredTidyTree(this.rootNode, false, this.option);
    WrapperdTree.convertBack(wt, this.rootNode, this.option);
    const boundingBox = this.getBoundingBox(this.rootNode);
    this.down2up(this.rootNode, boundingBox);
    return this.rootNode;
  }
}
