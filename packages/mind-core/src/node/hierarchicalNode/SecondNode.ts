import { Node } from "../Node";
import { ExpandNode } from "../contentNode/ExpandNode";
import { getTreeNodeTotal } from "../../utils";
import type { RootNode } from "../index";
import type { ISecondNodeProps } from "../index.d";
import type { DefaultNode } from "./DefaultNode";

export class SecondNode extends Node<RootNode, DefaultNode> {
  public expandNode?: ExpandNode;

  constructor(props: ISecondNodeProps<RootNode, DefaultNode>) {
    super({ ...props, nodeType: "second" });
  }
  public get children(): Node<DefaultNode, DefaultNode>[] {
    return this._children;
  }
  public set children(child: Node<DefaultNode, DefaultNode>[]) {
    if (child.length > 0) {
      /** 子节点总数 */
      const childTotal = getTreeNodeTotal(this.nodeData);
      this.expandNode = new ExpandNode(childTotal, this.group, this.style);
    }
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
}
