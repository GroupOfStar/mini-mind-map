import { G, Rect, Text } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import { Shape } from "./Shape";
import { Style } from "./../style";
import type { INodeData } from "./../graph/index.d";

export class RectShape extends Shape {
  id: string;
  private nodeStyle: Style;
  // rectConfig = {
  //   stroke: { width: 2, color: "#837a5c" },
  //   padding: 12,
  //   fill: { color: "#f06", opacity: 0.5 },
  //   radius: 4
  // };
  constructor(node: INodeData, nodeStyle: Style) {
    super(node);
    this.nodeStyle = nodeStyle;
    this.id = node.id;
  }
  get cWidth(): number {
    return this._tWidth + (this.nodeStyle.paddingX || 0) * 2;
  }
  get cHeight(): number {
    return this._tHeight + (this.nodeStyle.paddingY || 0) * 2;
  }
  get width(): number {
    // 最后一个是间距
    return this.cWidth + (this.nodeStyle.borderWidth || 0) * 2 + 6 * 2;
  }
  get height(): number {
    // 最后一个是间距
    return this.cHeight + (this.nodeStyle.borderWidth || 0) * 2 + 6 * 2;
  }
  // createBorderRect(w: number = 0, h: number = 0) {
  //   const rectNode = new Rect();
  //   rectNode.width(w).height(h);
  //   rectNode.cx(0).cy(0);

  //   const { stroke, radius, fill } = this.rectConfig;
  //   rectNode.stroke(stroke);
  //   rectNode.radius(radius);
  //   rectNode.fill(fill);

  //   this.group.add(rectNode);
  //   console.log("this.group.bbox() :", this.group.bbox());
  //   return rectNode;
  // }
  // draw() {
  //   const textSize = Utils.measureText(this.node.text || "");
  //   const { padding } = this.rectConfig;
  //   this.width = textSize.width + padding * 2;
  //   this.height = textSize.height + padding * 2;

  //   const textNode = this.createTextNode();
  //   const rectNode = this.createBorderRect(this.width, this.height);
  // }
}
