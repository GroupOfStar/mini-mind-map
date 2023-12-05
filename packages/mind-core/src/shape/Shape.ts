import { G, Rect, Text } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import { INodeData } from "src/graph";

export abstract class Shape {
  x: number;
  y: number;
  /** 文本的宽 */
  _tWidth: number;
  /** 文本的高 */
  _tHeight: number;
  // children: Shape[] = [];
  constructor(node: INodeData) {
    this.x = 0;
    this.y = 0;
    const text = node.text || "";
    const { width, height } = new Text().text(text).bbox();
    this._tWidth = width;
    this._tHeight = height;
  }
  /** 中间节点的宽 */
  abstract get cWidth(): number;
  /** 中间节点的高 */
  abstract get cHeight(): number;
  /** 整个节点的宽 */
  abstract get width(): number;
  /** 整个节点的高 */
  abstract get height(): number;
  // createTextNode() {
  //   const text = this.node.text || "";
  //   const textNode = new Text();
  //   textNode.addClass("textClass");
  //   textNode.text(text);
  //   textNode.cx(0).cy(0);

  //   this.group.add(textNode);
  //   return textNode;
  // }
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
