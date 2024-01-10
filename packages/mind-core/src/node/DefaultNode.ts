import { Node } from "./Node";
import { ExpandNode } from "./ExpandNode";
import { RectShape } from "./../shape";
import { getTreeNodeTotal } from "./../utils";
import type { SecondNode } from "./SecondNode";
import type { IDefaultNodeProps } from "./index.d";

export class DefaultNode extends Node<SecondNode | DefaultNode, DefaultNode> {
  public expandNode?: ExpandNode;
  public shape: RectShape;

  constructor(props: IDefaultNodeProps<SecondNode | DefaultNode, DefaultNode>) {
    super({ ...props, nodeType: "node" });
    /** 子节点总数 */
    const childTotal = getTreeNodeTotal(this.nodeData);
    if (childTotal > 0) {
      this.expandNode = new ExpandNode(childTotal, this.group, this.style);
    }
    this.shape = new RectShape({
      nodeData: this.nodeData,
      nodeStyle: this.style,
      group: this.group,
      expandNode: this.expandNode,
    });
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
