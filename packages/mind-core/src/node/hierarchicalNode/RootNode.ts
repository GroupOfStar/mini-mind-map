import { Node } from "../Node";
import { SecondNode } from "./SecondNode";
import { ExpandNode } from "../contentNode/ExpandNode";
import type { IRootNodeProps } from "../index.d";

export class RootNode extends Node<never, RootNode, SecondNode> {
  public expandNode?: ExpandNode;

  constructor(props: IRootNodeProps<never, RootNode, SecondNode>) {
    super({ ...props, currentNodeType: "root", childNodeType: "second" });
    this.expandNode = undefined;
  }
  public get children(): SecondNode[] {
    return this._children;
  }
  public set children(children: SecondNode[]) {
    this._children = children;
  }
  public init(): void {
    if (this.nodesGroup) {
      this.group.id(this.id);
      this.group.addTo(this.nodesGroup);
      this.shape.setNodeStyle(this.nodeData);
      this.shape.doNodeLayout();
    }
  }
  public addChildNode(): SecondNode {
    const secondNode = new SecondNode({
      nodesGroup: this.nodesGroup,
      nodeData: super.createInitNodeData(this.id, this.depth + 1),
    });
    secondNode.init();
    this.children = this.children.concat([secondNode]);
    return secondNode;
  }
}
