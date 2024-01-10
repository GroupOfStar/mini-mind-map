import { Node } from "./Node";
import { ExpandNode } from "./ExpandNode";
import { RectShape } from "./../shape";
import { getTreeNodeTotal } from "./../utils";
import type { RootNode } from "./index";
import type { ISecondNodeProps } from "./index.d";
import type { DefaultNode } from "./DefaultNode";

export class SecondNode extends Node<RootNode, DefaultNode> {
  public expandNode?: ExpandNode;
  public shape: RectShape;

  constructor(props: ISecondNodeProps<RootNode, DefaultNode>) {
    super({ ...props, nodeType: "second" });
    /** 子节点总数 */
    const childTotal = getTreeNodeTotal(this.nodeData);
    if (childTotal > 0) {
      this.expandNode = new ExpandNode(childTotal, this.group, this.style);
    }
    console.log("this.style :>> ", this.style);
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
