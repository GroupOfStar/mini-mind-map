import { SVG, G } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import { RootNode } from "src/node";

export type MindNodeType = "rootNode" | "secondNode" | "defaultNode";

export interface IGraphDataItem {
  id: string;
  pid: "root" | string;
  type: MindNodeType;
  text?: string;
  children?: IGraphDataItem[];
  [key: string]: any;
}

export class Graph {
  container: HTMLElement;
  dataList: IGraphDataItem[];
  dataTree: IGraphDataItem[];
  svg: SVGType.Svg;
  graphGroup: SVGType.G;
  group: SVGType.G;
  graphData: RootNode[] = [];

  constructor() {
    this.container = document.body;
    this.dataList = [];
    this.dataTree = [];
    this.svg = SVG().size("100%", "100%");
    this.svg.node.style.backgroundColor = "rgb(242, 242, 242)";
    this.graphGroup = new G({ class: "g-graph" });
    this.svg.add(this.graphGroup);
    this.group = new G({ class: "g-nodes" });
    this.graphGroup.add(this.group);
  }

  setContainer(container: HTMLElement) {
    this.container = container;
  }

  setDataList(data: IGraphDataItem[]) {
    this.dataList = data;
    function treeLoop(listData: IGraphDataItem[], parentId: string) {
      const children = listData.filter(item => item.pid === parentId);
      if (children.length === 0) {
        return [];
      } else {
        return children.map(item => ({
          ...item,
          children: treeLoop(listData, item.id)
        }));
      }
    }
    const fidRoot = data.find(item => item.type === "rootNode");
    if (fidRoot) {
      this.dataTree = [{ ...fidRoot, children: treeLoop(data, fidRoot.id) }];
    }
  }

  setDataTree(data: IGraphDataItem[]) {
    this.dataTree = data;
    function listLoop(treeData: IGraphDataItem[]) {
      const res: IGraphDataItem[] = [];
      treeData.forEach(({ children, ...rest }) => {
        res.push(rest);
        if (Array.isArray(children)) {
          res.push(...listLoop(children));
        }
      });
      return res;
    }
    this.dataList = listLoop(data);
  }

  onResize() {
    this.graphGroup.cx(window.innerWidth / 2).cy(window.innerHeight / 2);
  }

  render() {
    for (let i = 0; i < this.dataList.length; i++) {
      const item = this.dataList[i];
      const node = new RootNode(this.group, item);
      node.create();
    }
    this.svg.addTo(this.container);
  }
}
