import { Rect } from "@svgdotjs/svg.js";
import { Node } from "./Node";
import type * as SVGType from "@svgdotjs/svg.js";
import { IGraphDataItem } from "src/graph";

export class DefaultNode extends Node {
  constructor(group: SVGType.G, node: IGraphDataItem) {
    super(group, node);
  }
  create() {
    console.log("DefaultNode create");
  }
}
