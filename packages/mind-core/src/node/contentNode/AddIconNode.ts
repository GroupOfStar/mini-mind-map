import { SVG, G, Line } from "@svgdotjs/svg.js";
import { AddIcon } from "./../../svg";
import { AddIconNodeEvent } from "./AddIconNodeEvent";
import type { Graph } from "./../../graph";
import type { ITypeOfNodeType } from "../index.d";

/** 展开节点 */
export class AddIconNode {
  /** 线的长度 */
  static lineLength = 10;
  /** 线和图标图标之间的间隙 */
  static gap = 2;
  /** 线的宽度 */
  static lineWidth = 2;
  /** 图标大小 */
  static iconSize = 22;

  /** Graph */
  private graph: Graph;
  /** group */
  public group = new G({ class: "add-group" });
  /** 线 */
  protected lineEl = new Line({ x1: 0, y1: 0, x2: AddIconNode.lineLength, y2: 0 });
  /** 图标 */
  protected iconEl = SVG(AddIcon);
  /** 节点事件 */
  public event = new AddIconNodeEvent(this.group);

  constructor(graph: Graph) {
    this.graph = graph;
    this.group.addTo(graph.svg);
    this.lineEl.addTo(this.group);
    this.iconEl.addTo(this.group);
    this.setNodeStyle();
    this.doNodeLayout();
    this.event.bindEvent();
  }
  /** 节点所占宽度 */
  public get nodeWidth(): number {
    const { lineLength, gap, lineWidth, iconSize } = AddIconNode;
    return lineLength + gap + lineWidth + iconSize;
  }
  /** 节点所占高度 */
  private get nodeHeight(): number {
    const { lineWidth, iconSize } = AddIconNode;
    return lineWidth * 2 + iconSize;
  }
  /** 是否显示了 */
  public isShow(node?: ITypeOfNodeType) {
    const isDisplay = this.group.css("display") === "block";
    if (node) {
      return this.event.node === node && isDisplay;
    } else {
      return isDisplay;
    }
  }
  /** 设置节点样式 */
  private setNodeStyle() {
    const { iconSize } = AddIconNode;
    this.onHide();
    this.lineEl.stroke({ color: "#257BF1", width: 2, linecap: "round" });
    this.iconEl.size(iconSize, iconSize);
  }
  /** 设置布局 */
  private doNodeLayout(offset: number = 0) {
    const { lineWidth, iconSize } = AddIconNode;
    this.iconEl.center(this.nodeWidth - iconSize / 2, 0);
  }
  /** 显示新增功能 */
  public onShowByNode(node: ITypeOfNodeType) {
    const { x, y, selectedNodeWidth, selectedNodeHeight } = node.shape;
    console.log("x, y :>> ", x, y);
    const { x: graphX, y: graphY } = this.graph.nodesGroup.bbox();

    // const {
    //   graphBoundingBox: { width, height },
    // } = this.graph;
    // this.event.node = node;
    // this.group.move(
    //   width / 2 + x + selectedNodeWidth,
    //   height / 2 + y + selectedNodeHeight / 2 - this.nodeHeight / 2
    // );
    this.group.move(x + graphX, y + graphY);
    this.group.css({ display: "block" });
  }
  /** 隐藏新增功能 */
  public onHide() {
    this.group.css({ display: "none" });
  }
}
