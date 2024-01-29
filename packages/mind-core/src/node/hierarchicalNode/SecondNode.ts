import { Node } from "../Node";
import { ExpandNode } from "../contentNode/ExpandNode";
import { DefaultNode } from "./DefaultNode";
import type { RootNode } from "../index";
import type { ISecondNodeProps } from "../index.d";

export class SecondNode extends Node<RootNode, SecondNode, DefaultNode> {
  public expandNode?: ExpandNode;

  constructor(props: ISecondNodeProps<RootNode, SecondNode, DefaultNode>) {
    super({ ...props, nodeType: "second" });
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
    const secondNode = new SecondNode({
      nodesGroup: this.nodesGroup,
      nodeData: super.createInitNodeData(parentNode.id),
      parentNode,
    });
    secondNode.init();
    const brotherNodes = [...parentNode.children];
    const ind = brotherNodes.findIndex((item) => item === this);
    brotherNodes.splice(ind + 1, 0, secondNode);
    parentNode.children = brotherNodes;
    return secondNode;
  }
  public addChildNode() {
    const defaultNode = new DefaultNode({
      nodesGroup: this.nodesGroup,
      nodeData: super.createInitNodeData(this.id),
      parentNode: this,
    });
    defaultNode.init();
    this.children = this.children.concat([defaultNode]);
    return defaultNode;
  }
  public deleteActivatedNode(): RootNode | SecondNode {
    return super.deleteActivatedNode();
  }
}
