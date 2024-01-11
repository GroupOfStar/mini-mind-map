import { Node } from "../Node";
import { ExpandNode } from "../contentNode/ExpandNode";
import { getTreeNodeTotal } from "../../utils";
import type { SecondNode } from "./SecondNode";
import type { IDefaultNodeProps } from "../index.d";

export class DefaultNode extends Node<SecondNode | DefaultNode, DefaultNode> {
  public expandNode?: ExpandNode;

  constructor(props: IDefaultNodeProps<SecondNode | DefaultNode, DefaultNode>) {
    super({ ...props, nodeType: "node" });
  }
  public get children(): Node<DefaultNode, DefaultNode>[] {
    return this._children;
  }
  public set children(child: Node<DefaultNode, DefaultNode>[]) {
    if (child.length > 0) {
      /** 子节点总数 */
      const childTotal = getTreeNodeTotal(this.nodeData);
      this.expandNode = this.shape.expandNode = new ExpandNode(childTotal, this.group, this.style);
    }
    this._children = child;
  }
  public init(): void {
    if (this.nodesGroup) {
      this.group.id(this.id);
      this.group.addTo(this.nodesGroup);
      this.shape.setNodeStyle();
      this.shape.doNodeLayout();
      // 设置展开收缩节点
      if (this.expandNode) {
        this.expandNode.setNodeStyle();
        this.expandNode.doNodeLayout(this.shape.selectedNodeWidth / 2);
      }
    }
  }
}
