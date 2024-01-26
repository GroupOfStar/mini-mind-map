import { Node } from "../Node";
import { ExpandNode } from "../contentNode/ExpandNode";
import type { SecondNode } from "./SecondNode";
import type { IDefaultNodeProps } from "../index.d";

export class DefaultNode extends Node<SecondNode | DefaultNode, DefaultNode, DefaultNode> {
  public expandNode?: ExpandNode;

  constructor(props: IDefaultNodeProps<SecondNode | DefaultNode, DefaultNode, DefaultNode>) {
    super({ ...props, nodeType: "node" });
  }
  public get children(): DefaultNode[] {
    return this._children;
  }
  public set children(child: DefaultNode[]) {
    // if (child.length > 0) {
    //   /** 子节点总数 */
    //   const childTotal = getTreeNodeTotal(this.nodeData);
    //   this.expandNode = new ExpandNode(childTotal, this.group, this.style);
    // }
    this._children = child;
  }
  public init(): void {
    if (this.nodesGroup) {
      this.group.id(this.id);
      this.group.addTo(this.nodesGroup);
      this.shape.setNodeStyle(this.nodeData);
      this.shape.doNodeLayout();
      // 设置展开收缩节点
      if (this.expandNode) {
        this.expandNode.setNodeStyle();
        this.expandNode.doNodeLayout(this.shape.selectedNodeWidth / 2);
      }
    }
  }
  public addBrotherNode() {
    const parentNode = this.parentNode!;
    const defalutNode = new DefaultNode({
      nodesGroup: this.nodesGroup,
      nodeData: super.createInitNodeData(parentNode.id, this.depth),
      parentNode,
    });
    defalutNode.init();
    const brotherNodes = [...parentNode.children];
    const ind = brotherNodes.findIndex((item) => item === this);
    brotherNodes.splice(ind + 1, 0, defalutNode);
    parentNode.children = brotherNodes;
    return defalutNode;
  }
  public addChildNode() {
    const defaultNode = new DefaultNode({
      nodesGroup: this.nodesGroup,
      nodeData: super.createInitNodeData(this.id, this.depth + 1),
      parentNode: this,
    });
    defaultNode.init();
    this.children = this.children.concat([defaultNode]);
    return defaultNode;
  }
  public deleteActivatedNode(): SecondNode | DefaultNode {
    return super.deleteActivatedNode();
  }
}
