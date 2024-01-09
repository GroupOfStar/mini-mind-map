import { G } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import type { IEvents, INodeData } from "./../graph/index.d";
import { Style } from "./../style";
import { RectShape } from "./../shape";
import { normalNodeId } from "./../utils";
import type { INodeProps } from "./index.d";
import { Emitter } from "./../emitter/index.d";

export abstract class Node<P, C> implements ITreeNode<Node<C, C>> {
  /** 节点group挂载的group容器 */
  private nodesGroup: SVGType.G | undefined;
  /** 节点group */
  public group = new G();
  /** id */
  public id: string;
  /** 节点data */
  public nodeData: INodeData;
  /** 深度 */
  public depth: number = 0;
  /** 样式主题 */
  public style: Style;
  /** 形状 */
  public shape: RectShape;
  /** 父节点 */
  public parentNode?: Node<P, C>;
  /** 子节点 */
  public children: Node<C, C>[] = [];

  /** 事件广播 */
  public emitter?: Emitter<IEvents>;

  constructor(props: INodeProps<P, C>) {
    const { nodeData, nodesGroup, parentNode, nodeType, emitter } = props;
    this.id = normalNodeId(nodeData.id);
    this.nodesGroup = nodesGroup;
    this.nodeData = nodeData;
    this.parentNode = parentNode;
    this.style = new Style(nodeType);
    this.shape = new RectShape(nodeData, this.style, this.group);
    this.emitter = emitter;
  }
  /** 是否为根节点 */
  get isRoot() {
    return this.depth === 0;
  }
  /** init */
  init() {
    if (this.nodesGroup) {
      this.group.id(this.id);
      this.group.addTo(this.nodesGroup);
      this.shape.init();
    }
  }
  /** 设置位置 */
  transform(matrixAlias: {
    rotate: number;
    translateX: number;
    translateY: number;
    scale: number;
  }) {
    this.group.transform(matrixAlias);
  }
  /** 节点鼠标移入事件 */
  onMouseover(event: Event) {
    event.stopPropagation();
    const { borderNodeEl } = this.shape;
    if (!borderNodeEl.hasClass("active")) {
      borderNodeEl.stroke({ width: 1, color: "#caa2ff" });
    }
  }
  /** 节点鼠标移出事件 */
  onMouseout(event: Event) {
    event.stopPropagation();
    const { borderNodeEl } = this.shape;
    if (!borderNodeEl.hasClass("active")) {
      borderNodeEl.stroke({ width: 1, color: "transparent" });
    }
  }
  /** 节点点击事件 */
  onClick(event: Event) {
    const { x, y, width, height, borderNodeEl } = this.shape;
    const { marginX, marginY } = this.style;
    console.log(
      `${this.nodeData.text}:>>`,
      " x :",
      x,
      " y :",
      y,
      " width :",
      width,
      " height :",
      height,
      " marginX :",
      marginX,
      " marginY :",
      marginY
    );
    event.stopPropagation();
    // 先取消容器组下所有的active样式
    this.nodesGroup?.find("rect.active").forEach((item) => {
      item.stroke({ width: 1, color: "transparent" });
      item.removeClass("active");
    });
    // 再给当前的节点加上active样式
    borderNodeEl.addClass("active");
    borderNodeEl.stroke({ width: 1, color: "#7716d9" });
  }
  /** 注册事件 */
  bindEvent() {
    this.onMouseover = this.onMouseover.bind(this);
    this.onMouseout = this.onMouseout.bind(this);
    this.onClick = this.onClick.bind(this);

    this.group.on("mouseover", this.onMouseover);
    this.group.on("mouseout", this.onMouseout);
    this.group.on("click", this.onClick);
  }
  /** 解除事件 */
  unbindEvent() {
    this.group.off();
  }
}
