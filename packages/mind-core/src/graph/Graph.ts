import { SVG, G } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import * as Structure from "./../layout";
import { DefaultNode, RootNode, SecondNode } from "./../node";
import { Theme } from "./../style";
import { Emitter } from "./../emitter";
import { getEdgePoint, quadraticCurvePath, cubicBezierPath, drawEdge } from "./../dom";
import { forDeepEachTree, forScopeEachTree } from "./../utils";
import { GraphEvent } from "./GraphEvent";
import { INodeData, IEvents } from "./index.d";

export class Graph extends Emitter<IEvents> {
  theme: Theme;
  el: HTMLElement = document.body;
  dataTree: INodeData[] = [];
  rootNode?: RootNode;
  svg: SVGType.Svg;
  graphGroup: SVGType.G;
  nodesGroup: SVGType.G;
  linesGroup: SVGType.G;
  /** 事件 */
  graphEvent: GraphEvent;

  constructor() {
    super();
    this.theme = new Theme();
    this.svg = SVG().size("100%", "100%");
    const { backgroundColor = "#fff" } = this.theme.config;
    this.svg.node.style.backgroundColor = backgroundColor;
    this.graphGroup = new G({ class: "g-graph" }).addTo(this.svg);
    this.linesGroup = new G({ class: "g-lines" }).addTo(this.graphGroup);
    this.nodesGroup = new G({ class: "g-nodes" }).addTo(this.graphGroup);
    this.graphEvent = new GraphEvent(this);
  }
  // 获取画布定位
  get position() {
    const {
      x = 0,
      y = 0,
      visibleNodeWidth = 0,
      visibleNodeHeight = 0,
    } = this.rootNode?.shape || {};
    let pointX = 0;
    let pointY = window.innerHeight / 2 - y - visibleNodeHeight / 2;
    switch (this.theme.config.layout) {
      case "LeftLogical":
        pointX = (window.innerWidth * 2) / 3 - x - visibleNodeWidth / 2;
        break;
      case "Standard":
        pointX = window.innerWidth / 2 - x - visibleNodeWidth / 2;
        break;
      case "DownwardOrganizational":
        pointX = window.innerWidth / 2 - x - visibleNodeWidth / 2;
        pointY = window.innerHeight / 3 - y - visibleNodeHeight / 2;
        break;
      case "UpwardOrganizational":
        pointX = window.innerWidth / 2 - x - visibleNodeWidth / 2;
        pointY = (window.innerHeight * 2) / 3 - y - visibleNodeHeight / 2;
        break;
      case "RightLogical":
        pointX = window.innerWidth / 3 + x;
        break;
    }
    return { x: pointX, y: pointY };
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
    const position = this.position;
    this.graphGroup.x(position.x).y(position.y);
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
    this.bindEvent();
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
    }
  }
  /** 画布点击事件 */
  onSvgClick(event: Event) {
    event.stopPropagation();
    this.emit("graph_click", event);
    this.nodesGroup.find("rect.active").forEach((item) => {
      item.stroke({ width: 1, color: "transparent" });
      item.removeClass("active");
    });
  }
  /** 注册事件 */
  bindEvent() {
    this.onSvgClick = this.onSvgClick.bind(this);
    /** 画布点击事件 */
    this.svg.on("click", this.onSvgClick);

    this.on("node_click", () => {
      if (this.rootNode) {
        forDeepEachTree((node) => {
          node.shape.setDeActivation();
        }, this.rootNode);
      }
    });
  }
  /** 解除事件 */
  unbindEvent() {
    this.svg.off();
    this.off("*", () => {});
  }
}
