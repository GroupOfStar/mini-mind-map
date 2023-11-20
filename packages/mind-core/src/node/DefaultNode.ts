import { Rect } from "@svgdotjs/svg.js";
import { MindNode } from "./";
import type * as SVGType from "@svgdotjs/svg.js";
import { IMindDataItem } from "src/graph";

export class DefaultNode extends MindNode {
  constructor(group: SVGType.G, node: IMindDataItem) {
    super(group, node);
  }
  create() {
    console.log("DefaultNode create");
  }
}
