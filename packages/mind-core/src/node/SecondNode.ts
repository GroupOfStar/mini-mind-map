import type * as SVGType from "@svgdotjs/svg.js";
import { MindNode } from "./";
import { Rect } from "@svgdotjs/svg.js";
import { IMindDataItem } from "src/graph";

export class SecondNode extends MindNode {
  // node: SVGType.Rect;
  constructor(group: SVGType.G, node: IMindDataItem) {
    super(group, node);

    // this.node = new Rect().size(100, 100).fill({ color: "#f06", opacity: 0.5 });
    // this.group.add(this.node);
  }
  create() {
    console.log("SecondNode create");
  }
}
