import { SVG, G } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import * as Structure from "./../layout";
import { DefaultNode, RootNode, SecondNode, AddIconNode } from "./../node";
import type { ITypeOfNodeType } from "./../node/index.d";
import { Theme } from "./../style";
import { getEdgePoint, quadraticCurvePath, cubicBezierPath, drawEdge } from "./../dom";
import { forScopeEachTree } from "./../utils";
import { GraphEvent } from "./GraphEvent";
import { INodeData } from "./index.d";

export class Graph {
  public theme: Theme;
  public el: HTMLElement = document.body;
  public dataTree: INodeData[] = [];
  /** 画布 */
  public rootNode?: RootNode;
  /** 画布 */
  public svg: SVGType.Svg;
  /** 画布内容 */
  private graphGroup: SVGType.G;
  /** 节点组 */
  public nodesGroup: SVGType.G;
  /** 线组 */
  public linesGroup: SVGType.G;
  /** 激活的节点 */
  public activatedNodes: Set<ITypeOfNodeType> = new Set();
  /** 新增功能icon */
  public addIconNode: AddIconNode;
  /** 事件 */
  public event: GraphEvent;

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
    this.addIconNode.group.addTo(this.svg);
    this.event = new GraphEvent(this);
  }
  // 获取各种类型布局下画布的偏移量
  get graphOffset() {
    let offsetX = 0;
    let offsetY = window.innerHeight / 2;
    switch (this.theme.config.layout) {
      case "LeftLogical":
        offsetX = (window.innerWidth * 2) / 3;
        break;
      case "Standard":
        offsetX = window.innerWidth / 2;
        break;
      case "DownwardOrganizational":
        offsetX = window.innerWidth / 2;
        offsetY = window.innerHeight / 3;
        break;
      case "UpwardOrganizational":
        offsetX = window.innerWidth / 2;
        offsetY = (window.innerHeight * 2) / 3;
        break;
      case "RightLogical":
        offsetX = window.innerWidth / 3;
        break;
    }
    return { offsetX, offsetY };
  }
  // 获取graphGroup的边界信息
  get graphBoundingBox() {
    return this.graphGroup.rbox();
  }
  /**
   * 设置SVG将要挂载的HTMLElement容器
   * @param el SVG挂载的HTMLElement容器
   */
  setContainer(el: HTMLElement) {
    this.el = el;
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
  /**
   * window 的resize事件
   * 始终保持根节点的y在窗口中间，x根据布局类型来设置在窗口1/3处
   */
  onResize() {
    console.log("onResize");
    const { offsetX, offsetY } = this.graphOffset;
    const { width, height } = this.graphGroup.rbox();
    const {
      x = 0,
      y = 0,
      selectedNodeWidth = 0,
      selectedNodeHeight = 0,
    } = this.rootNode?.shape || {};
    this.el.scroll(
      x + width / 2 + selectedNodeWidth / 2 - offsetX,
      y + height / 2 + selectedNodeHeight / 2 - offsetY
    );
  }
  /** 渲染 */
  render() {
    console.log("render");
    const walk = <T extends INodeData>(
      data: T[],
      parentNode?: RootNode | SecondNode | DefaultNode
    ) => {
      return data.map((nodeData) => {
        const depth = nodeData.depth || 0;
        let node: RootNode | SecondNode | DefaultNode;
        const nodePorps = {
          nodeData,
          nodesGroup: this.nodesGroup,
          parentNode,
        };
        switch (depth) {
          case 0:
            node = new RootNode(nodePorps);
            break;
          case 1:
            node = new SecondNode(nodePorps);
            break;
          case 2:
          default:
            node = new DefaultNode(nodePorps);
            break;
        }
        node.depth = depth;
        node.children = walk(nodeData.children, node);
        node.init();
        return node;
      });
    };
    this.rootNode = walk(this.dataTree)[0];
    this.svg.addTo(this.el);
  }
  /** 布局 */
  layout() {
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
      const layout = new MindmapLayout(this.rootNode, layoutOption);
      const rootNode = layout.doLayout();
      forScopeEachTree((node) => {
        node.group.x(node.shape.x).y(node.shape.y);
        node.children.forEach((child) => {
          const edgePoint = getEdgePoint(child, node, isHorizontal, {
            ...layoutOption,
            getFrontSideOffset: (n) => n.shape.selectedBoxPadding,
          });
          const path = node?.isRoot ? quadraticCurvePath(edgePoint) : cubicBezierPath(edgePoint);
          drawEdge(this, path, edgePoint);
        });
      }, rootNode);

      const { width, height } = this.graphBoundingBox;
      // this.svg.size(width, height);

      this.svg.size(width * 2, height * 2);
      this.graphGroup.x(width / 2).y(height / 2);
    }
  }
}
