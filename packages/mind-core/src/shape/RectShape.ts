import { G, Rect, Text } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import { Shape } from "./Shape";
import { Utils } from "src/utils";
import { IGraphDataItem } from "src/graph";

export class RectShape extends Shape {
  id: string;
  rectConfig = {
    stroke: { width: 2, color: "#837a5c" },
    padding: 12,
    fill: { color: "#f06", opacity: 0.5 },
    radius: 4
  };
  constructor(node: IGraphDataItem) {
    super(node);
    this.id = node.id;
  }

  createBorderRect(w: number = 0, h: number = 0) {
    const rectNode = new Rect();
    rectNode.width(w).height(h);
    rectNode.cx(0).cy(0);

    const { stroke, radius, fill } = this.rectConfig;
    rectNode.stroke(stroke);
    rectNode.radius(radius);
    rectNode.fill(fill);

    this.group.add(rectNode);
    console.log("this.group.bbox() :", this.group.bbox());
    return rectNode;
  }
  draw() {
    const textSize = Utils.measureText(this.node.text || "");
    const { padding } = this.rectConfig;
    this.width = textSize.width + padding * 2;
    this.height = textSize.height + padding * 2;

    const rectNode = this.createBorderRect(this.width, this.height);
    const textNode = this.createTextNode();
  }
}
