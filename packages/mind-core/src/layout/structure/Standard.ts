import { Layout } from "./Layout";
import { nonLayeredTidyTree } from "../algorithms";
import { RootNode } from "./../../node";

export class Standard extends Layout {
  doLayout() {
    // separate into left and right trees
    const leftTree = new RootNode({ nodeData: this.rootNode.nodeData });
    const rightTree = new RootNode({ nodeData: this.rootNode.nodeData });
    const treeSize = this.rootNode.children.length;
    const rightTreeSize = Math.round(treeSize / 2);
    for (let i = 0; i < treeSize; i++) {
      const child = this.rootNode.children[i];
      if (i < rightTreeSize) {
        rightTree.children.push(child);
      } else {
        leftTree.children.push(child);
      }
    }
    // do layout for left and right trees
    nonLayeredTidyTree(rightTree, true);
    nonLayeredTidyTree(leftTree, true);
    leftTree.right2left();
    // combine left and right trees
    rightTree.translate(leftTree.shape.x - rightTree.shape.x, leftTree.shape.y - rightTree.shape.y);
    // translate rootNode
    this.rootNode.shape.x = leftTree.shape.x;
    this.rootNode.shape.y = rightTree.shape.y;
    const bb = this.rootNode.getBoundingBox();
    if (bb.top < 0) {
      this.rootNode.translate(0, -bb.top);
    }
    return this.rootNode;
  }
}
