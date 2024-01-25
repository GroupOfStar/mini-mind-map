import { G, Rect } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import type { INodeData } from "./../graph/index.d";
import { Style } from "./../style";
import { RectShape } from "./../shape";
import { NodeEvent } from "./NodeEvent";
import { normalNodeId } from "./../utils";
import { v4 as uuidv4 } from "uuid";
import type { ExpandNode } from "./contentNode/ExpandNode";
import type { INodeProps, ITypeOfNodeType } from "./index.d";
import type { DefaultNode } from "./hierarchicalNode/DefaultNode";
import type { SecondNode } from "./hierarchicalNode/SecondNode";

export abstract class Node<
  P extends ITypeOfNodeType | never,
  C extends ITypeOfNodeType,
  D extends SecondNode | DefaultNode
> implements ITreeNode<Node<P, C, D>>
{
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
  public parentNode?: P;
  /** 子节点 */
  protected _children: D[] = [];
  /** 样式主题 */
  public style: Style;
  /** 展开收缩节点 */
  public abstract expandNode?: ExpandNode;
  /** 形状 */
  public shape: RectShape<P, C, D>;
  /** 节点事件 */
  public event = new NodeEvent(this);

  constructor(props: INodeProps<P, C, D>) {
    const { nodeData, nodesGroup, parentNode, currentNodeType, childNodeType } = props;
    this.id = normalNodeId(nodeData.id);
    this.nodesGroup = nodesGroup;
    this.nodeData = nodeData;
    this.parentNode = parentNode;
    this.style = new Style(currentNodeType);
    this.shape = new RectShape(this);
  }
  /** 是否为根节点 */
  get isRoot() {
    return this.depth === 0;
  }
  public abstract get children(): D[];
  public abstract set children(children: D[]);
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
  /**
   * 创建初始化的节点数据
   * @param pid 父节点id
   * @param depth 深度
   * @returns 节点数据
   */
  protected createInitNodeData(pid: string, depth: number): INodeData {
    return { id: uuidv4(), pid, depth, text: "输入文字", children: [] };
  }
  /** 添加子节点 */
  public abstract addChildNode(): D;
}
