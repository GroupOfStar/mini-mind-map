import { SVG, G } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import * as Structure from "./../layout";
import { DefaultNode, Node, RootNode, SecondNode } from "./../node";
import { Theme } from "./../style";
import { emitter } from "./../emitter";
import type { Emitter } from "./../emitter/index.d";
import { getEdgePoint, quadraticCurvePath, cubicBezierPath, drawEdge } from "./../dom";
import { forScopeEachTree, mapTree } from "./../utils";
import { GraphEvent } from "./GraphEvent";
import { INodeData, IEvents } from "./index.d";

export class Graph {
  theme: Theme;
  el: HTMLElement = document.body;
  dataTree: INodeData[] = [];
  rootNode?: RootNode;
  svg: SVGType.Svg;
  graphGroup: SVGType.G;
  nodesGroup: SVGType.G;
  linesGroup: SVGType.G;
  /** 事件广播 */
  emitter: Emitter<IEvents>;
  /** 事件 */
  graphEvent: GraphEvent;

  constructor() {
    this.theme = new Theme();
    this.svg = SVG().size("100%", "100%");
    const { backgroundColor = "#fff" } = this.theme.config;
    this.svg.node.style.backgroundColor = backgroundColor;
    this.graphGroup = new G({ class: "g-graph" }).addTo(this.svg);
    this.linesGroup = new G({ class: "g-lines" }).addTo(this.graphGroup);
    this.nodesGroup = new G({ class: "g-nodes" }).addTo(this.graphGroup);
    this.emitter = emitter();
    this.graphEvent = new GraphEvent(this);
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
    const { x = 0, y = 0, width = 0, height = 0 } = this.rootNode?.shape || {};
    let pointX = 0;
    let pointY = window.innerHeight / 2 - y - height / 2;
    switch (this.theme.config.layout) {
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
    this.graphGroup.transform({ translateX: 0, translateY: 0 });
    this.graphGroup.x(pointX).y(pointY);
  }
  /** 渲染 */
  render() {
    const nodeTree = mapTree((nodeData, index, parentNode) => {
      const depth = nodeData.depth || 0;
      let node: RootNode | SecondNode | DefaultNode;
      const nodePorps = {
        nodeData,
        nodesGroup: this.nodesGroup,
        parentNode: parentNode as Node<RootNode, DefaultNode>,
        emitter: this.emitter,
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
      node.init();
      node.bindEvent();
      return node;
    }, this.dataTree);
    this.rootNode = nodeTree[0] as RootNode;

    this.bindEvent();
    this.svg.addTo(this.el);
  }
  /** 布局 */
  layout() {
    if (this.rootNode) {
      this.linesGroup.clear();
      const { config, isHorizontal } = this.theme;
      console.log("this.theme.config.layout :>> ", config.layout);
      const MindmapLayout = Structure[config.layout];
      const layoutOption: Structure.ILayoutOption<RootNode> = {
        getWidth: (node) => {
          const { width, selectedWidth } = node.shape;
          return isHorizontal ? width : selectedWidth;
        },
        getHeight: (node) => {
          const { height, selectedHeight } = node.shape;
          return isHorizontal ? selectedHeight : height;
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
        node.children.forEach((child) => {
          const edgePoint = getEdgePoint(child, node, isHorizontal, {
            ...layoutOption,
            getFrontSideOffset: (node) => node.shape.selectedBoxPadding,
            getBtnSideOffset: (node) => {
              const { selectedBoxPadding, expandNodeWidth } = node.shape;
              return selectedBoxPadding + expandNodeWidth;
            },
          });
          const path = node?.isRoot ? quadraticCurvePath(edgePoint) : cubicBezierPath(edgePoint);
          drawEdge(this, path, edgePoint);
        });
        node.group.cx(node.shape.x).cy(node.shape.y);
      }, rootNode);
    }
  }
  /** 画布点击事件 */
  onSvgClick(event: Event) {
    event.stopPropagation();
    this.nodesGroup.find("rect.active").forEach((item) => {
      item.stroke({ width: 1, color: "transparent" });
      item.removeClass("active");
    });
  }
  // /** 画布按下事件 */
  // onSvgMousedown(event: Event) {
  //   console.log("onSvgMousedown event :>> ", event);
  //   event.preventDefault();
  //   event.stopPropagation();
  // }
  /** 注册事件 */
  bindEvent() {
    this.onSvgClick = this.onSvgClick.bind(this);
    // this.onSvgMousedown = this.onSvgMousedown.bind(this);

    /** 画布点击事件 */
    this.svg.on("click", this.onSvgClick);
    // this.emitter.on("graph_click", this.onSvgClick);

    // this.svg.on("mousedown", this.onSvgMousedown);
    // window.addEventListener("mousemove", this.onMousemove);
    // window.addEventListener("mouseup", this.onMouseup);
  }
  /** 解除事件 */
  unbindEvent() {
    this.svg.off();
  }
}
