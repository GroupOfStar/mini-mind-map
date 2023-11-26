import { G, Rect, Text } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import { INodeData } from "./../graph";
import { Style } from "./../style";
import type { INodeType } from "./../style";

export class Node {
  group: G;
  nodeData: INodeData;
  style: Style;
  //   text?: string;
  //   expand?: boolean;
  //   color?: string;
  //   children?: Node[];
  constructor(nodeData: INodeData, nodesGroup: SVGType.G, nodeType: INodeType) {
    this.group = new G().addTo(nodesGroup);
    this.nodeData = nodeData;
    this.style = new Style(nodeType);
  }
}
