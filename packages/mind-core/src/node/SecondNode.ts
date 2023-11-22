import type * as SVGType from "@svgdotjs/svg.js";
import { Node } from "./Node";
import { Rect } from "@svgdotjs/svg.js";
import { IGraphDataItem } from "src/graph";

export class SecondNode extends Node {
  // node: SVGType.Rect;
  constructor(group: SVGType.G, node: IGraphDataItem) {
    super(group, node);

    // this.node = new Rect().size(100, 100).fill({ color: "#f06", opacity: 0.5 });
    // this.group.add(this.node);
  }
  create() {
    console.log("SecondNode create");
  }
}
