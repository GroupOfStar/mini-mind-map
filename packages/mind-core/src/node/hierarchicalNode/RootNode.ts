import { Node } from "../Node";
import { ExpandNode } from "../contentNode/ExpandNode";
import type { IRootNodeProps } from "../index.d";
import type { SecondNode } from "../index";

export class RootNode extends Node<null, SecondNode> {
  public expandNode?: ExpandNode;

  constructor(props: IRootNodeProps<null, SecondNode>) {
    super({ ...props, nodeType: "root" });
    this.expandNode = undefined;
  }
  public get children(): Node<SecondNode, SecondNode>[] {
    return this._children;
  }
  public set children(children: Node<SecondNode, SecondNode>[]) {
    this._children = children;
  }
  public init(): void {
    if (this.nodesGroup) {
      this.group.id(this.id);
      this.group.addTo(this.nodesGroup);
      this.shape.setNodeStyle();
      this.shape.doNodeLayout();
    }
  }
}
