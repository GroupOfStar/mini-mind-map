import { Rect, Text } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import type { INodeData } from "./../graph/index.d";
import { Node } from "src/node";

export abstract class Shape<P, C> {
  /** 节点group */
  private group: SVGType.G;
  /** 边框节点 */
  protected selectedNodeEl = new Rect();
  /** 可视节点 */
  protected visibleNodeEl = new Rect();
  /** 文本节点 */
  protected textNodeEl = new Text();

  public x: number = 0;
  public y: number = 0;

  constructor(node: Node<P, C>) {
    this.group = node.group;
    this.selectedNodeEl = node.selectedNodeEl;

    // 创建节点
    this.createNode(node.nodeData);
  }
  /** 可视节点的宽 */
  abstract get visibleNodeWidth(): number;
  /** 可视节点的高 */
  abstract get visibleNodeHeight(): number;
  /** 选中盒子的内边距 */
  abstract get selectedBoxPadding(): number;
  /** 选中后节点的宽 */
  abstract get selectedNodeWidth(): number;
  /** 选中后节点的高 */
  abstract get selectedNodeHeight(): number;
  /** 创建节点 */
  createNode(node: INodeData) {
    // 节点边框
    this.selectedNodeEl.addTo(this.group).addClass("selected-node");
    const { text = "" } = node;
    // 文本节点
    this.textNodeEl.addClass("text").text(text);
    // 节点本身
    this.visibleNodeEl.addTo(this.group).addClass("node");
    // 确保text节点在最后一个, 所以最后添加
    this.textNodeEl.addTo(this.group);
  }
  /** 设置样式 */
  abstract setNodeStyle(): void;
  /** 节点布局 */
  abstract doNodeLayout(): void;
  /** 设置激活 */
  public setActivation() {
    // 再给当前的节点加上active样式
    this.selectedNodeEl.addClass("active");
    this.selectedNodeEl.stroke({ color: "#7716d9" });
  }
  /** 设置取消激活 */
  public setDeActivation() {
    this.selectedNodeEl.stroke({ color: "transparent" });
    this.selectedNodeEl.removeClass("active");
  }
  /** 设置鼠标移入样式 */
  public setMouseoverStyle() {
    if (!this.selectedNodeEl.hasClass("active")) {
      this.selectedNodeEl.stroke({ color: "#caa2ff" });
    }
  }
  /** 设置鼠标移出样式 */
  public setMouseoutStyle() {
    if (!this.selectedNodeEl.hasClass("active")) {
      this.selectedNodeEl.stroke({ color: "transparent" });
    }
  }
}
