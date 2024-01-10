import { Rect, Text } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import type { INodeData } from "./../graph/index.d";

export abstract class Shape {
  private group: SVGType.G;

  /** 边框节点 */
  public selectedNodeEl = new Rect();
  /** 可视节点 */
  protected visibleNodeEl = new Rect();
  /** 文本节点 */
  protected textNodeEl = new Text();

  public x: number = 0;
  public y: number = 0;

  constructor(node: INodeData, group: SVGType.G) {
    this.group = group;
    // 创建节点
    this.createNode(node);
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
  /** 整个节点的宽 */
  abstract get width(): number;
  /** 整个节点的高 */
  abstract get height(): number;
  /** 创建节点 */
  createNode(node: INodeData) {
    const { text = "" } = node;
    // 文本节点
    this.textNodeEl.addClass("text").text(text);
    // 节点边框
    this.selectedNodeEl.addTo(this.group).addClass("node-border");
    // 节点本身
    this.visibleNodeEl.addTo(this.group).addClass("node");
    // 确保text节点在最后一个, 所以最后添加
    this.textNodeEl.addTo(this.group);
  }
  /** 设置样式 */
  abstract setNodeStyle(): void;
  /** 节点布局 */
  abstract doNodeLayout(): void;
}
