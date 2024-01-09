import { G, Rect, Text } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import type { INodeData } from "./../graph/index.d";
import { getTreeNodeTotal, normalNodeId } from "./../utils";

export abstract class Shape {
  private group: SVGType.G;

  /** 边框节点 */
  public borderNodeEl = new Rect();
  /** 可视节点 */
  protected thisNodeEl = new Rect();
  /** 文本节点 */
  protected textNodeEl = new Text();

  /** 展开节点group */
  protected expandNodeGroup = new G({ class: "expand-group" });
  /** 展开节点框 */
  protected expandBoxNodeEl: SVGType.Rect | undefined;
  /** 展开节点的节点数节点 */
  protected expandTextNodeEl: SVGType.Text | undefined;

  public x: number = 0;
  public y: number = 0;
  /** 文本的宽 */
  // protected _tWidth: number;
  // /** 文本的高 */
  // protected _tHeight: number;
  /** 子节点总数 */
  protected childTotal: number;

  constructor(node: INodeData, group: SVGType.G) {
    this.group = group;
    this.childTotal = getTreeNodeTotal(node);
    // 创建节点
    this.createNode(node);
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
  /** 创建节点 */
  createNode(node: INodeData) {
    const { text = "" } = node;
    // 文本节点
    this.textNodeEl.addClass("text").text(text);
    // 节点边框
    this.borderNodeEl.addTo(this.group).addClass("node-border");
    // 节点本身
    this.thisNodeEl.addTo(this.group).addClass("node");
    // 确保text节点在最后一个, 所以最后添加
    this.textNodeEl.addTo(this.group);
  }
  /** 设置样式 */
  abstract setNodeStyle(): void;
  /** 节点布局 */
  abstract doNodeLayout(): void;

  /** 创建展开收缩节点 */
  createExpandNode() {
    this.expandTextNodeEl = new Text().addClass("expand-text");
    this.expandTextNodeEl.text(this.childTotal.toString());
    this.expandBoxNodeEl = new Rect().addClass("expand-box");

    this.expandNodeGroup.add(this.expandTextNodeEl);
    this.expandNodeGroup.add(this.expandBoxNodeEl);
    // 添加展开节点
    this.expandNodeGroup.addTo(this.group);
  }
  /** 设置展开收缩节点样式 */
  abstract setExpandNodeStyle(): void;
  /** 展开收缩布局 */
  abstract doExpandNodeLayout(): void;
  /** init */
  abstract init(): void;
}
