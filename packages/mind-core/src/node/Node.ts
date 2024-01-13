import { G } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import type { IEvents, INodeData } from "./../graph/index.d";
import { Style } from "./../style";
import { RectShape } from "./../shape";
import { normalNodeId } from "./../utils";
import type { INodeProps } from "./index.d";
import { Emitter } from "./../emitter";
import type { ExpandNode } from "./contentNode/ExpandNode";

export abstract class Node<P, C> extends Emitter<IEvents> implements ITreeNode<Node<C, C>> {
  /** 节点group挂载的group容器 */
  protected nodesGroup: SVGType.G | undefined;
  /** 节点group */
  public group = new G();
  /** id */
  public id: string;
  /** 节点data */
  public nodeData: INodeData;
  /** 深度 */
  public depth: number = 0;
  /** 父节点 */
  public parentNode?: Node<P, C>;
  /** 子节点 */
  protected _children: Node<C, C>[] = [];

  /** 样式主题 */
  public style: Style;
  /** 展开收缩节点 */
  public abstract expandNode?: ExpandNode;
  /** 形状 */
  public shape: RectShape;

  constructor(props: INodeProps<P, C>) {
    super();
    const { nodeData, nodesGroup, parentNode, nodeType } = props;
    this.id = normalNodeId(nodeData.id);
    this.nodesGroup = nodesGroup;
    this.nodeData = nodeData;
    this.parentNode = parentNode;
    this.style = new Style(nodeType);
    this.shape = new RectShape({
      nodeData: this.nodeData,
      nodeStyle: this.style,
      group: this.group,
    });
  }
  /** 是否为根节点 */
  get isRoot() {
    return this.depth === 0;
  }
  public abstract get children();
  public abstract set children(children: Node<C, C>[]);
  /** init */
  public abstract init(): void;
  /** 设置位置 */
  public transform(matrixAlias: {
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
    const { selectedNodeEl } = this.shape;
    if (!selectedNodeEl.hasClass("active")) {
      selectedNodeEl.stroke({ width: 1, color: "#caa2ff" });
    }
  }
  /** 节点鼠标移出事件 */
  onMouseout(event: Event) {
    event.stopPropagation();
    const { selectedNodeEl } = this.shape;
    if (!selectedNodeEl.hasClass("active")) {
      selectedNodeEl.stroke({ width: 1, color: "transparent" });
    }
  }
  /** 节点点击事件 */
  onClick(event: Event) {
    const { x, y, selectedNodeWidth, selectedNodeHeight, selectedNodeEl } = this.shape;
    const { marginX, marginY } = this.style;
    console.log(
      `${this.nodeData.text}:>>`,
      " x :",
      x,
      " y :",
      y,
      " selectedNodeWidth :",
      selectedNodeWidth,
      " selectedNodeHeight :",
      selectedNodeHeight,
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
    selectedNodeEl.addClass("active");
    selectedNodeEl.stroke({ width: 1, color: "#7716d9" });
  }
  /** 注册事件 */
  bindEvent() {
    this.onMouseover = this.onMouseover.bind(this);
    this.onMouseout = this.onMouseout.bind(this);
    this.onClick = this.onClick.bind(this);

    this.shape.selectedNodeEl.on("mouseover", this.onMouseover);
    this.shape.selectedNodeEl.on("mouseout", this.onMouseout);
    this.shape.selectedNodeEl.on("click", this.onClick);
  }
  /** 解除事件 */
  unbindEvent() {
    this.shape.selectedNodeEl.off();
  }
}
