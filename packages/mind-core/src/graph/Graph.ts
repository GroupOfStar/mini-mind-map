import { SVG, G } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import * as Structure from "src/layout";
import { DefaultNode, RootNode, SecondNode } from "src/node";
import { Canvas, INodeTheme } from "src/style";
import { drawEdge } from "./drawEdge";

export interface INodeData {
  id: string;
  pid: "root" | string;
  depth?: number;
  text?: string;
  theme?: INodeTheme;
  children?: INodeData[];
  [key: string]: any;
}

export class Graph {
  canvas: Canvas;
  container: HTMLElement;
  dataTree: INodeData[];
  rootNode?: RootNode;
  svg: SVGType.Svg;
  graphGroup: SVGType.G;
  nodesGroup: SVGType.G;
  linesGroup: SVGType.G;

  constructor() {
    this.svg = SVG().size("100%", "100%");
    this.svg.node.style.backgroundColor = "rgb(242, 242, 242)";
    this.graphGroup = new G({ class: "g-graph" }).addTo(this.svg);
    this.nodesGroup = new G({ class: "g-nodes" }).addTo(this.graphGroup);
    this.linesGroup = new G({ class: "g-lines" }).addTo(this.graphGroup);

    this.canvas = new Canvas();
    this.container = document.body;
    this.dataTree = [];
  }
  /**
   * 设置SVG将要挂载的HTMLElement容器
   * @param container SVG挂载的HTMLElement容器
   */
  setContainer(container: HTMLElement) {
    this.container = container;
  }
  /**
   * 通过一维的节点数组设置成节点树数据
   * @param {INodeData[]} list 一维节点数组
   * @param {INodeData['pid']} rootPid 根节点的pid
   */
  setDataByList(list: INodeData[], rootPid: INodeData["pid"]) {
    function treeLoop(listData: INodeData[], parentId: string, pDeep: number) {
      const children = listData.filter((item) => item.pid === parentId);
      if (children.length === 0) {
        return [];
      } else {
        return children.map((item) => ({
          ...item,
          depth: pDeep + 1,
          children: treeLoop(listData, item.id, pDeep + 1),
        }));
      }
    }
    const fidRoot = list.find((item) => item.pid === rootPid);
    if (fidRoot) {
      this.dataTree = [{ ...fidRoot, depth: 0, children: treeLoop(list, fidRoot.id, 0) }];
    }
  }
  /** 遍历树得到新的数据 */
  mapTree<T extends RootNode | SecondNode | DefaultNode>(
    callback: (nodeData: INodeData, index: number, parentNode?: T) => T
  ): T[] {
    function walk(data: any[], parentNode?: T) {
      return data.map((item, index) => {
        const node = callback(item, index, parentNode);
        if (Array.isArray(item.children)) {
          node.children = walk(item.children, node);
        }
        return node;
      });
    }
    return walk(this.dataTree);
  }
  /** 给画布注册事件 */
  addEventListener() {
    // 取消所有节点的active样式状态
    if (this.container) {
      this.svg.on("click", (event) => {
        event.stopPropagation();
        this.nodesGroup.find("rect.active").forEach((item) => {
          item.stroke({ width: 1, color: "transparent" });
          item.removeClass("active");
        });
      });
    }
  }
  /**
   * window 的resize事件
   * 始终保持根节点的y在窗口中间，x根据布局类型来设置在窗口1/3处
   */
  onResize() {
    const { x = 0, y = 0, width = 0, height = 0 } = this.rootNode?.shape || {};
    let pointX = 0;
    let pointY = window.innerHeight / 2 - y - height / 2;
    switch (this.canvas.layout) {
      case "LeftLogical":
        pointX = (window.innerWidth * 2) / 3 - x - width / 2;
        break;
      case "Standard":
        pointX = window.innerWidth / 2 - x - width / 2;
        break;
      case "DownwardOrganizational":
        pointX = window.innerWidth / 2 - x - width / 2;
        pointY = window.innerHeight / 3 - y - height / 2;
        break;
      case "UpwardOrganizational":
        pointX = window.innerWidth / 2 - x - width / 2;
        pointY = (window.innerHeight * 2) / 3 - y - height / 2;
        break;
      case "RightLogical":
        pointX = window.innerWidth / 3 + x;
        break;
    }
    this.graphGroup.x(pointX).y(pointY);
  }
  /** 渲染 */
  render() {
    const nodeTree = this.mapTree((nodeData, index, parentNode) => {
      const depth = nodeData.depth || 0;
      let node: RootNode | SecondNode | DefaultNode;
      switch (depth) {
        case 0:
          node = new RootNode(nodeData, this.nodesGroup);
          break;
        case 1:
          node = new SecondNode(nodeData, this.nodesGroup, parentNode);
          break;
        case 2:
        default:
          node = new DefaultNode(nodeData, this.nodesGroup, parentNode);
          break;
      }
      node.depth = depth;
      node.setNodeStyle();
      node.addEventListener();
      return node;
    });
    this.rootNode = nodeTree[0] as RootNode;
    this.addEventListener();
    this.svg.addTo(this.container);
  }
  /** 布局 */
  layout() {
    if (this.rootNode) {
      this.linesGroup.clear();
      const MindmapLayout = Structure[this.canvas.layout];
      const layout = new MindmapLayout(this.rootNode);
      const rootNode = layout.doLayout();
      rootNode.eachNode((node) => {
        node.children.forEach((child, index) => {
          drawEdge(this, child, index, node, this.canvas.isHorizontal);
        });
        node.group.cx(node.shape.x).cy(node.shape.y);
      });
    }
  }
}
