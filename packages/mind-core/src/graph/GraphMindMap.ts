import { Rect, SVG, Text } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import { DefaultNode, RootMindNode, SecondNode } from "src/node";

export interface IGraphOption {
  container: HTMLElement;
  width?: SVGType.NumberAlias;
  height?: SVGType.NumberAlias;
}

export type MindNodeType = "rootNode" | "secondNode" | "defaultNode";

export interface IMindDataItem {
  id: string;
  pid: "root" | string;
  type: MindNodeType;
  text?: string;
  [key: string]: any;
}

export class GraphMindMap {
  container: HTMLElement;
  draw: SVGType.Svg;
  group: SVGType.G;
  graphData: (RootMindNode | SecondNode | DefaultNode)[] = [];

  constructor(option: IGraphOption) {
    const { width = "100%", height = "100%" } = option;
    this.container = option.container;
    this.draw = SVG().size(width, height);
    this.group = this.draw.group();
    this.group.attr({ transform: "translate(100, 100)" });
  }

  data(data: IMindDataItem[]) {
    console.log("data :>> ", data);
    this.graphData = data.map(item => {
      switch (item.type) {
        case "rootNode":
          return new RootMindNode(this.group, item);
        case "secondNode":
          return new SecondNode(this.group, item);
        case "defaultNode":
          return new DefaultNode(this.group, item);
        default:
          throw new Error("不存在的节点类型");
      }
    });
  }

  getGraphTree() {
    console.log("getGraphTree this.graphData");
    for (let i = 0; i < this.graphData.length; i++) {
      const item = this.graphData[i];
      item.getTextNodeRect();
      item.setGroupNodeSize();
      item.moveTo(10, 15);
    }
  }

  render() {
    this.draw.addTo(this.container);
    this.getGraphTree();
  }
}
