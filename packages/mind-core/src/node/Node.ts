import { G, Rect } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import type { INodeData } from "./../graph/index.d";
import { Style } from "./../style";
import { RectShape } from "./../shape";
import { NodeEvent } from "./NodeEvent";
import { normalNodeId } from "./../utils";
import type { ExpandNode } from "./contentNode/ExpandNode";
import type { INodeProps } from "./index.d";

export abstract class Node<P, C> implements ITreeNode<Node<P, C>> {
  /** 节点group挂载的group容器 */
  protected nodesGroup: SVGType.G | undefined;
  /** 节点group */
  public group = new G();
  /** 边框节点 */
  public selectedNodeEl = new Rect();
  /** id */
  public id: string;
  /** 节点data */
  public nodeData: INodeData;
  /** 深度 */
  public depth: number = 0;
  /** 父节点 */
  public parentNode?: Node<P, C>;
  /** 子节点 */
  protected _children: Node<P, C>[] = [];

  /** 样式主题 */
  public style: Style;
  /** 展开收缩节点 */
  public abstract expandNode?: ExpandNode;
  /** 形状 */
  public shape: RectShape<P, C>;
  /** 节点事件 */
  public event = new NodeEvent(this);

  constructor(props: INodeProps<P, C>) {
    const { nodeData, nodesGroup, parentNode, nodeType } = props;
    this.id = normalNodeId(nodeData.id);
    this.nodesGroup = nodesGroup;
    this.nodeData = nodeData;
    this.parentNode = parentNode;
    this.style = new Style(nodeType);
    this.shape = new RectShape(this);
    // 节点边框
    this.selectedNodeEl.addTo(this.group).addClass("selected-node");
  }
  /** 是否为根节点 */
  get isRoot() {
    return this.depth === 0;
  }
  public abstract get children();
  public abstract set children(children: Node<P, C>[]);
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
}
