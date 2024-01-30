import { SVG, G, Line } from "@svgdotjs/svg.js";
import { Emitter } from "./../../emitter";
import { AddIcon } from "./../../svg";
import type { IEvents, Graph } from "./../../graph";
import type { ITypeOfNodeType } from "../index.d";

/** 展开节点 */
export class AddIconNode extends Emitter<IEvents> {
  /** 线的长度 */
  static lineLength = 10;
  /** 线和图标图标之间的间隙 */
  static gap = 2;
  /** 线的宽度 */
  static lineWidth = 2;
  /** 图标大小 */
  static iconSize = 22;

  /** Graph */
  public graph: Graph;
  /** group */
  public group = new G({ class: "add-group" });
  /** 线 */
  protected lineEl = new Line({ x1: 0, y1: 0, x2: AddIconNode.lineLength, y2: 0 });
  /** 图标 */
  protected iconEl = SVG(AddIcon);
  /** 当前新增按钮挂载的节点 */
  private _node?: ITypeOfNodeType;

  constructor(graph: Graph) {
    super();
    this.graph = graph;
    this.group.addTo(graph.svg);
    this.lineEl.addTo(this.group);
    this.iconEl.addTo(this.group);
    this.setNodeStyle();
    this.doNodeLayout();
    this.bindEvent();
  }
  /** 节点所占宽度 */
  public get nodeWidth(): number {
    const { lineLength, gap, lineWidth, iconSize } = AddIconNode;
    return lineLength + gap + lineWidth + iconSize;
  }
  /** 节点所占高度 */
  private get nodeHeight(): number {
    const { iconSize } = AddIconNode;
    return iconSize;
  }
  /** 注册事件 */
  public bindEvent() {
    this.onClick = this.onClick.bind(this);
    this.group.on("click", this.onClick);
  }
  /** 解除事件 */
  public unbindEvent() {
    this.group.off();
  }
  /** 节点点击事件 */
  private onClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this._node) {
      this.addChildToNode(this._node);
      this.emit("addIcon_click", this._node);
    }
  }
  /** 是否显示了 */
  public isShow(node?: ITypeOfNodeType) {
    const isDisplay = this.group.css("display") === "block";
    if (node) {
      return this._node === node && isDisplay;
    } else {
      return isDisplay;
    }
  }
  /** 设置节点样式 */
  private setNodeStyle() {
    const { iconSize } = AddIconNode;
    this.lineEl.stroke({ color: "#257BF1", width: 2, linecap: "round" });
    this.iconEl.size(iconSize, iconSize);
    this.onHide();
  }
  /** 设置布局 */
  private doNodeLayout(offset: number = 0) {
    const { lineWidth, iconSize } = AddIconNode;
    this.iconEl.center(this.nodeWidth - iconSize / 2, 0);
  }
  /** 显示新增功能 */
  public onShowByNode(node: ITypeOfNodeType) {
    this._node = node;
    const { x, y, selectedNodeWidth, selectedNodeHeight } = node.shape;
    const { x: graphX, y: graphY } = this.graph.nodesGroup.bbox();
    this.group.move(
      x + graphX + selectedNodeWidth,
      y + graphY + selectedNodeHeight / 2 - this.nodeHeight / 2
    );
    this.group.css({ display: "block" });
  }
  /** 隐藏新增功能 */
  public onHide() {
    this.group.css({ display: "none" });
  }
  /** 新增子节点 */
  public addChildToNode(node: ITypeOfNodeType) {
    const newNode = node.addChildNode();
    this.onHide();
    this.graph.onScrollToNode(node);
    this.graph.activatedNode.keepOne(newNode);
  }
}
