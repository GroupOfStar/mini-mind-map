import { G, Rect, Text } from "@svgdotjs/svg.js";
import { IGraphDataItem } from "src/graph";
import { SVGTreeNode } from "./SVGTreeNode";

export class Node {
  group: G;
  node: IGraphDataItem;
  //   text?: string;
  //   expand?: boolean;
  //   color?: string;
  //   children?: Node[];
  constructor(group: G, node: IGraphDataItem) {
    this.group = group;
    this.node = node;
  }

  //   getTextNodeRect() {
  //     const fidText = this.nodeGroup.findOne("text.textClass") as Text;
  //     console.log("fidText.bbox() :>> ", fidText.bbox());
  //     const textRect = fidText?.node.getBoundingClientRect();
  //     console.log("textRect :>> ", textRect);
  //     const { padding } = this.rectConfig;
  //     if (fidText) {
  //       fidText.x(padding).y(padding);
  //     }
  //     return textRect;
  //   }
  //   setGroupNodeSize() {
  //     const { padding } = this.rectConfig;
  //     const width = padding * 2 + (this.getTextNodeRect()?.width || 0);
  //     const height = padding * 2 + (this.getTextNodeRect()?.height || 0);
  //     const rectNode = this.nodeGroup.findOne("rect") as Rect;
  //     if (rectNode) {
  //       rectNode.size(width, height);
  //     }
  //   }
  //   moveTo(x: number, y: number) {
  //     this.nodeGroup.x(x).y(y);
  //   }
}
