import { G, Rect, Text } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import { MindNode } from "./";
import { IMindDataItem } from "src/graph";

export class RootMindNode extends MindNode {
  constructor(group: SVGType.G, node: IMindDataItem) {
    super(group, node);
  }

  create() {
    console.log("RootMindNode create");
  }
}
