import { G, Rect, Text } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import type { IEvents, INodeData } from "./../graph/index.d";
import { Style } from "./../style";
import { RectShape } from "./../shape";
import type { INodeProps } from "./index.d";
import { Emitter } from "./../emitter/index.d";

export abstract class Node<P, C> implements ITreeNode<Node<P, C>> {
  /** 节点group挂载的group容器 */
  nodesGroup: G;
  /** 节点group */
  group: G;
  /** id */
  id: string;
  /** 节点data */
  nodeData: INodeData;
  /** 深度 */
  depth: number = 0;
  /** 样式主题 */
  style: Style;
  /** 形状 */
  shape: RectShape;
  /** 父节点 */
  parentNode?: Node<P, C>;
  /** 子节点 */
  children: Node<P, C>[] = [];
  /** 边框节点 */
  protected borderNode = new Rect();
  /** 事件广播 */
  emitter?: Emitter<IEvents>;

  constructor(props: INodeProps<P, C>) {
    const { nodeData, nodeType, nodesGroup, parentNode, emitter } = props;
    const id = nodeData.id.trim();
    this.id = id;
    this.group = new G().attr({ id: id.replace(/#|-/g, "") });
    if (nodesGroup) {
      this.nodesGroup = nodesGroup;
      this.group.addTo(nodesGroup);
    } else {
      this.nodesGroup = new G();
    }
    this.nodeData = nodeData;
    this.parentNode = parentNode;
    this.style = new Style(nodeType);
    this.shape = new RectShape(nodeData, this.style);
    this.emitter = emitter;
  }
  /** 是否为根节点 */
  get isRoot() {
    return this.depth === 0;
  }
  /** 设置节点样式 */
  abstract setNodeStyle(): void;
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
    if (!this.borderNode.hasClass("active")) {
      this.borderNode.stroke({ width: 1, color: "#caa2ff" });
    }
  }
  /** 节点鼠标移出事件 */
  onMouseout(event: Event) {
    event.stopPropagation();
    if (!this.borderNode.hasClass("active")) {
      this.borderNode.stroke({ width: 1, color: "transparent" });
    }
  }
  /** 节点点击事件 */
  onClick(event: Event) {
    const { x, y, width, height } = this.shape;
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
    this.nodesGroup.find("rect.active").forEach((item) => {
      item.stroke({ width: 1, color: "transparent" });
      item.removeClass("active");
    });
    // 再给当前的节点加上active样式
    this.borderNode.addClass("active");
    this.borderNode.stroke({ width: 1, color: "#7716d9" });
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
