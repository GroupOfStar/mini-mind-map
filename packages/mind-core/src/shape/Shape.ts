import { G, Rect, Text } from "@svgdotjs/svg.js";
import type { INodeData } from "./../graph/index.d";

export abstract class Shape {
  x: number;
  y: number;
  /** 子节点总高度 */
  childAreaHeight = 0;
  /** 文本的宽 */
  protected _tWidth: number;
  /** 文本的高 */
  protected _tHeight: number;
  /** 展开图标文本的宽 */
  public _expandTWidth: number;
  /** 展开图标文本的高 */
  public _expandTHeight: number;
  // children: Shape[] = [];
  constructor(node: INodeData) {
    this.x = 0;
    this.y = 0;
    const text = node.text || "";
    const { width, height } = new Text().text(text).bbox();
    this._tWidth = width;
    this._tHeight = height;
    this._expandTWidth = 0;
    this._expandTHeight = 0;
  }
  /** 可视节点的宽 */
  abstract get visibleWidth(): number;
  /** 可视节点的高 */
  abstract get visibleHeight(): number;
  /** 可视节点的水平偏移 */
  abstract get visibleHOffset(): number;
  /** 可视节点的垂直偏移 */
  abstract get visibleVOffset(): number;
  /** 选中后节点的宽 */
  abstract get selectedWidth(): number;
  /** 选中后节点的高 */
  abstract get selectedHeight(): number;
  /** 整个节点的宽 */
  abstract get width(): number;
  /** 整个节点的高 */
  abstract get height(): number;
  // createTextNode() {
  //   const text = this.node.text || "";
  //   const textNode = new Text();
  //   textNode.addClass("textClass");
  //   textNode.text(text);
  //   textNode.cx(0).cy(0);

  //   this.group.add(textNode);
  //   return textNode;
  // }
}
