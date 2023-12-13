// import { Layout } from "./Layout";
// import { nonLayeredTidyTree } from "../algorithms";
// import { Node } from "./../../node";

// export class Standard extends Layout {
//   doLayout() {
//     const me = this;
//     const rootNode = me.rootNode;
//     const options = me.options;
//     // separate into left and right trees
//     const leftTree = new Node(rootNode.data, options, true);
//     const rightTree = new Node(rootNode.data, options, true);
//     const treeSize = rootNode.children.length;
//     const rightTreeSize = Math.round(treeSize / 2);
//     for (let i = 0; i < treeSize; i++) {
//       const child = rootNode.children[i];
//       if (i < rightTreeSize) {
//         rightTree.children.push(child);
//       } else {
//         leftTree.children.push(child);
//       }
//     }
//     // do layout for left and right trees
//     nonLayeredTidyTree(rightTree, true);
//     nonLayeredTidyTree(leftTree, true);
//     leftTree.right2left();
//     // combine left and right trees
//     rightTree.translate(leftTree.x - rightTree.x, leftTree.y - rightTree.y);
//     // translate rootNode
//     rootNode.x = leftTree.x;
//     rootNode.y = rightTree.y;
//     const bb = rootNode.getBoundingBox();
//     if (bb.top < 0) {
//       rootNode.translate(0, -bb.top);
//     }
//     return rootNode;
//   }
// }
