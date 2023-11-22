import { G, Rect, Text } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import { IGraphDataItem } from "src/graph";

export class Shape {
  group: SVGType.Element;
  node: IGraphDataItem;
  x: number;
  y: number;
  width: number;
  height: number;
  // children: Shape[] = [];
  constructor(node: IGraphDataItem) {
    this.group = new G({ id: node.id });
    this.node = node;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
  }
  createTextNode() {
    const text = this.node.text || "";
    const textNode = new Text();
    textNode.addClass("textClass");
    textNode.text(text);
    textNode.cx(0).cy(0);

    this.group.add(textNode);
    return textNode;
  }
  // private loopThisTree(
  //   callback: (item: SVGTreeNode) => void,
  //   treeNode: SVGTreeNode[] = [this]
  // ) {
  //   for (let i = 0; i < treeNode.length; i++) {
  //     const item = treeNode[i];
  //     callback(item);
  //     if (Array.isArray(item.children)) {
  //       item.loopThisTree(callback, item.children);
  //     }
  //   }
  // }
  // setChildren(treeNode: Shape[]) {
  //   for (let i = 0; i < treeNode.length; i++) {
  //     const item = treeNode[i];
  //     this.children.push(item);
  //   }
  // }
}
