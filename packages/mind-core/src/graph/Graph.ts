import { SVG, G } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import { DefaultNode, RootNode, SecondNode } from "src/node";
import { Canvas, INodeTheme } from "src/style";

export interface INodeData {
  id: string;
  pid: "root" | string;
  deep?: number;
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

  constructor() {
    this.svg = SVG().size("100%", "100%");
    this.svg.node.style.backgroundColor = "rgb(242, 242, 242)";
    this.graphGroup = new G({ class: "g-graph" }).addTo(this.svg);
    this.nodesGroup = new G({ class: "g-nodes" }).addTo(this.graphGroup);

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
      const children = listData.filter(item => item.pid === parentId);
      if (children.length === 0) {
        return [];
      } else {
        return children.map(item => ({
          ...item,
          deep: pDeep + 1,
          children: treeLoop(listData, item.id, pDeep + 1)
        }));
      }
    }
    const fidRoot = list.find(item => item.pid === rootPid);
    if (fidRoot) {
      this.dataTree = [
        { ...fidRoot, deep: 0, children: treeLoop(list, fidRoot.id, 0) }
      ];
    }
  }

  /** 遍历树得到新的数据 */
  mapTree<T extends RootNode | SecondNode | DefaultNode>(
    callback: (nodeData: INodeData, index: number) => T
  ): T[] {
    function walk(data: any[]) {
      return data.map((item, index) => {
        const node = callback(item, index);
        if (Array.isArray(item.children)) {
          node.children = walk(item.children);
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
      this.container.addEventListener("click", () => {
        this.nodesGroup.find("rect.active").forEach(item => {
          item.stroke({ width: 1, color: "transparent" });
          item.removeClass("active");
        });
      });
    }
  }

  /** window 的resize事件 */
  onResize() {
    this.graphGroup.cx(window.innerWidth / 2).cy(window.innerHeight / 2);
  }

  /** 渲染 */
  render() {
    const nodeTree = this.mapTree((nodeData, index) => {
      const deep = nodeData.deep || 0;
      let node: RootNode | SecondNode | DefaultNode;
      switch (deep) {
        case 0:
          node = new RootNode(nodeData, this.nodesGroup);
          break;
        case 1:
          node = new SecondNode(nodeData, this.nodesGroup);
          break;
        case 2:
        default:
          node = new DefaultNode(nodeData, this.nodesGroup);
          break;
      }
      node.setNodeStyle();
      node.transform({
        rotate: 0,
        translateX: deep * 60 + index * 120,
        translateY: deep * 60 - index * 120,
        scale: 1
      });
      node.addEventListener();
      return node;
    });
    this.rootNode = nodeTree[0] as RootNode;
    console.log("this.rootNode :>> ", this.rootNode);

    this.addEventListener();

    this.svg.addTo(this.container);
  }
}
