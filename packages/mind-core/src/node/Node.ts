import { G, Rect } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import type { INodeData } from "./../graph/index.d";
import { Style } from "./../style";
import { RectShape } from "./../shape";
import { NodeEvent } from "./NodeEvent";
import { forScopeEachTree, normalNodeId, uuidv4 } from "./../utils";
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
    const { nodeData, nodesGroup, parentNode, nodeType } = props;
    this.id = normalNodeId(nodeData.id);
    this.nodesGroup = nodesGroup;
    this.nodeData = nodeData;
    this.parentNode = parentNode;
    this.style = new Style(nodeType);
    this.shape = new RectShape(this);
  }
  /** 是否为根节点 */
  get isRoot() {
    return this.constructor.name === "RootNode";
  }
  public abstract get children(): D[];
  public abstract set children(children: D[]);

  /** init */
  public abstract init(): void;
  /** 添加同级节点 */
  public abstract addBrotherNode(): C;
  /** 添加子节点 */
  public abstract addChildNode(nodeData: INodeData): D;
  /** 添加子节点 */
  protected _addChildNode(node: D): D {
    node.init();
    this.children = this.children.concat([node]);
    return node;
  }
  /** 删除节点 */
  public deleteActivatedNode(): P | C {
    const parentNode = this.parentNode!;
    const brotherNodes = [...parentNode.children];
    const ind = brotherNodes.findIndex((item) => item === this);
    brotherNodes.splice(ind, 1);
    parentNode.children = brotherNodes;
    forScopeEachTree((node) => {
      node.group.remove();
    }, this);
    // 如果没有兄弟节点了
    if (brotherNodes.length === 0) {
      return parentNode;
    } else {
      // 是最后一个节点就返回前一个
      if (ind === brotherNodes.length) {
        return brotherNodes[ind - 1] as C;
      } else {
        return brotherNodes[ind] as C;
      }
    }
  }
  /**
   * 创建初始化的节点数据
   * @param pid 父节点id
   * @returns 节点数据
   */
  static createInitNodeData(pid: string): INodeData {
    return { id: uuidv4(), pid, text: "输入文字", children: [] };
  }
  /**
   * 把节点对象还原成节点的原始数据结构
   * @param node 节点对象
   * @returns 节点原始数据，id为新创建的id
   */
  static toRaw<T extends Node<ITypeOfNodeType | never, ITypeOfNodeType, SecondNode | DefaultNode>>(
    node: T
  ): INodeData {
    return {
      ...node.nodeData,
      id: uuidv4(),
      children: node.children.map(Node.toRaw),
    };
  }
}
