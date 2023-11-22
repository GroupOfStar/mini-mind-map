import { G, Rect, Text } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import { Node } from "./Node";
import { SVGTreeNode } from "./SVGTreeNode";
import { IGraphDataItem } from "src/graph";
import { Utils } from "src/utils";
import { RectShape } from "src/shape";

export class RootNode extends Node {
  rectShape: RectShape;
  constructor(group: SVGType.G, node: IGraphDataItem) {
    super(group, node);

    this.rectShape = new RectShape(node);
  }

  create() {
    this.rectShape.draw();
    // this.SVGTreeNode.dom.x(100).y(100);
    this.group.add(this.rectShape.group);
  }
}
