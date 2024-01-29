import { SVG, G } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import * as Structure from "./../layout";
import { DefaultNode, RootNode, SecondNode, AddIconNode } from "./../node";
import type { ITypeOfNodeType } from "./../node/index.d";
import { ILayoutType, Theme } from "./../style";
import { getEdgePoint, quadraticCurvePath, cubicBezierPath, drawEdge } from "./../dom";
import { forScopeEachTree } from "./../utils";
import { GraphEvent } from "./GraphEvent";
import { INodeData } from "./index.d";

class ActivatedNode {
  private _nodes: Set<ITypeOfNodeType> = new Set();
  private addIconNode: AddIconNode;
  constructor(addIconNode: AddIconNode) {
    this.addIconNode = addIconNode;
  }
  public get nodes() {
    return this._nodes;
  }
  public set nodes(val: Set<ITypeOfNodeType>) {
    this._nodes = val;
  }
  /** 获取第一个节点 */
  public get firstNode(): ITypeOfNodeType | undefined {
    return this._nodes.values().next().value;
  }
  public has(node: ITypeOfNodeType) {
    return this._nodes.has(node);
  }
  public add(node: ITypeOfNodeType) {
    if (!this.has(node)) {
      node.shape.setActivation();
      this._nodes.add(node);
    }
    return this;
  }
  public delete(node: ITypeOfNodeType) {
    if (this.has(node)) {
      node.shape.setDeActivation();
      this._nodes.delete(node);
    }
    return this;
  }
  public clear() {
    this._nodes.forEach((item) => {
      this.delete(item);
    });
  }
  /**保留一个 */
  public keepOne(node: ITypeOfNodeType): void {
    if (this.has(node)) {
      this._nodes.forEach((item) => {
        if (item !== node) {
          this.delete(item);
        }
      });
    } else {
      this.clear();
      this.add(node);
    }
    if (node.children.length > 0) {
      this.addIconNode.onHide();
    } else {
      // 显示新增按钮 并注册相关快捷键
      this.addIconNode.onShowByNode(node);
    }
  }
}

export class Graph {
  public readonly theme: Theme;
  public el: HTMLElement = document.body;
  public dataTree: INodeData[] = [];
  /** 画布 */
  public rootNode?: RootNode;
  /** 画布 */
  public readonly svg: SVGType.Svg;
  /** 画布内容 */
  public readonly graphGroup: SVGType.G;
  /** 节点组 */
  public readonly nodesGroup: SVGType.G;
  /** 线组 */
  public readonly linesGroup: SVGType.G;
  /** 新增功能icon */
  public readonly addIconNode: AddIconNode;
  /** 激活的节点 */
  public readonly activatedNode: ActivatedNode;
  /** 事件 */
  public readonly event: GraphEvent;
  /** layout */
  private layout?: InstanceType<(typeof Structure)[ILayoutType]>;
  static PasteNodeText: () => string;

  constructor() {
    this.theme = new Theme();
    this.svg = SVG();
    // svg为内联块元素，其位于文本基线上，在底部会留下容纳字符下行符（'y'，'g'等的尾部）的空间，所以要设置display:block去掉该空间。
    this.svg.css({ display: "block" });
    const { backgroundColor = "#fff" } = this.theme.config;
    // @ts-ignore
    this.svg.css({ "background-color": backgroundColor });
    this.graphGroup = new G({ class: "g-graph" }).addTo(this.svg);
    this.linesGroup = new G({ class: "g-lines" }).addTo(this.graphGroup);
    this.nodesGroup = new G({ class: "g-nodes" }).addTo(this.graphGroup);
    this.addIconNode = new AddIconNode(this);
    this.activatedNode = new ActivatedNode(this.addIconNode);
    this.event = new GraphEvent(this);
  }
  /**
   * 设置SVG将要挂载的HTMLElement容器
   * @param el SVG挂载的HTMLElement容器
   */
  public setContainer(el: HTMLElement) {
    this.el = el;
  }
  /**
   * 通过一维的节点数组设置成节点树数据
   * @param {INodeData[]} list 一维节点数组
   * @param {INodeData['pid']} rootPid 根节点的pid
   */
  public setDataByList(list: INodeData[], rootPid: INodeData["pid"]) {
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
  /**
   * window 的resize事件
   * 始终保持根节点的y在窗口中间，x根据布局类型来设置在窗口1/3处
   */
  public onResize(node: ITypeOfNodeType | undefined = this.rootNode, layout = this.layout?.offset) {
    console.log("node :>> ", node);
    const { offsetX = 0, offsetY = 0 } = layout || {};
    const { cx = 0, cy = 0 } = node?.group.bbox() || {};
    this.el.scroll(cx - offsetX, cy - offsetY);
  }
  /** 渲染 */
  public render() {
    this.svg.addTo(this.el);
    const walk = <T extends INodeData>(
      data: T[],
      parentNode?: RootNode | SecondNode | DefaultNode
    ) => {
      return data.map((nodeData) => {
        const depth = nodeData.depth || 0;
        let node: RootNode | SecondNode | DefaultNode;
        switch (depth) {
          case 0:
            node = new RootNode({ nodeData, nodesGroup: this.nodesGroup });
            break;
          case 1:
            node = new SecondNode({
              nodeData,
              nodesGroup: this.nodesGroup,
              parentNode: parentNode as RootNode,
            });
            break;
          case 2:
          default:
            node = new DefaultNode({
              nodeData,
              nodesGroup: this.nodesGroup,
              parentNode: parentNode as SecondNode,
            });
            break;
        }
        node.children = walk(nodeData.children, node) as any[];
        node.init();
        return node as RootNode;
      });
    };
    this.rootNode = walk(this.dataTree)[0];
  }
  /** 布局 */
  public doLayout() {
    console.log("layout");
    if (this.rootNode) {
      this.linesGroup.clear();
      const { isHorizontal, config } = this.theme;
      const MindmapLayout = Structure[config.layout];
      const layoutOption: Structure.ILayoutOption<RootNode> = {
        getWidth: (node) => {
          const { selectedNodeWidth } = node.shape;
          return selectedNodeWidth;
        },
        getHeight: (node) => {
          const { selectedNodeHeight } = node.shape;
          return selectedNodeHeight;
        },
        getHGap: (node) => node.style.marginX,
        getVGap: (node) => node.style.marginY,
        getX: (node) => node.shape.x,
        setX: (node, val) => {
          node.shape.x = val;
        },
        getY: (node) => node.shape.y,
        setY: (node, val) => {
          node.shape.y = val;
        },
      };
      this.layout = new MindmapLayout(this.rootNode, layoutOption);
      const rootNode = this.layout.doLayout();
      forScopeEachTree((node) => {
        node.group.x(node.shape.x).y(node.shape.y);
        node.children.forEach((child) => {
          const edgePoint = getEdgePoint(child, node as any, isHorizontal, {
            ...layoutOption,
            getFrontSideOffset: (n) => n.shape.selectedBoxPadding,
          });
          const path = node?.isRoot ? quadraticCurvePath(edgePoint) : cubicBezierPath(edgePoint);
          drawEdge(this, path, edgePoint);
        });
      }, rootNode);
      const { width, height } = this.graphGroup.rbox();
      // this.svg.size(width, height);
      const svgWidth = Math.max(width, window.innerWidth) + width;
      const svgHeight = Math.max(height, window.innerHeight) + height;
      this.svg.size(svgWidth, svgHeight);
      this.graphGroup.x(svgWidth / 2 - width / 2).y(svgHeight / 2 - height / 2);
    }
  }
}

Graph.PasteNodeText = () => {
  console.log("object");
  return "";
};
