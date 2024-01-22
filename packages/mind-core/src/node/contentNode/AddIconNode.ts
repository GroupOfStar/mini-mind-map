import { SVG, G, Line } from "@svgdotjs/svg.js";
import { AddIcon } from "./../../svg";
import { AddIconNodeEvent } from "./AddIconNodeEvent";

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

  /** group */
  public group = new G({ class: "add-group" });
  /** 线 */
  protected lineEl = new Line({ x1: 0, y1: 0, x2: AddIconNode.lineLength, y2: 0 });
  /** 图标 */
  protected iconEl = SVG(AddIcon);
  /** 节点事件 */
  public event = new AddIconNodeEvent(this);

  constructor() {
    this.lineEl.addTo(this.group);
    this.iconEl.addTo(this.group);
    this.setNodeStyle();
    this.doNodeLayout();
    this.event.bindEvent();
  }
  /** 节点所占宽度 */
  public get nodeWidth(): number {
    const { lineLength, gap, iconSize } = AddIconNode;
    return lineLength + gap + iconSize;
  }
  /** 节点所占高度 */
  public get nodeHeight(): number {
    const { lineWidth, iconSize } = AddIconNode;
    return lineWidth * 2 + iconSize;
  }
  /** 设置节点样式 */
  public setNodeStyle() {
    const { iconSize } = AddIconNode;
    this.lineEl.stroke({ color: "#257BF1", width: 2, linecap: "round" });
    this.iconEl.size(iconSize, iconSize);
  }
  /** 设置布局 */
  public doNodeLayout(offset: number = 0) {
    const { lineWidth, iconSize } = AddIconNode;
    this.iconEl.center(this.nodeWidth - iconSize / 2 - lineWidth, 0);
    this.group.transform({
      translateX: 50,
      translateY: 60,
    });
  }
}
