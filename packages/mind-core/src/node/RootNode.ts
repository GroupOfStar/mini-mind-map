import { Node } from "./Node";
import { ExpandNode } from "./ExpandNode";
import { RectShape } from "./../shape";
import type { IRootNodeProps } from "./index.d";
import type { SecondNode } from "./index";

export class RootNode extends Node<null, SecondNode> {
  public expandNode?: ExpandNode;
  public shape: RectShape;

  constructor(props: IRootNodeProps<null, SecondNode>) {
    super({ ...props, nodeType: "root" });
    this.expandNode = undefined;
    this.shape = new RectShape({
      nodeData: this.nodeData,
      nodeStyle: this.style,
      group: this.group,
    });
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
