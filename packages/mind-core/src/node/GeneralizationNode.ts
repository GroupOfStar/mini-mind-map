import { Node } from "./Node";
import { DefaultNode } from "./DefaultNode";
import { ExpandNode } from "./ExpandNode";
import { RectShape } from "./../shape";
import type { IGeneralizationNodeProps } from "./index.d";

export class GeneralizationNode extends Node<DefaultNode, unknown> {
  public expandNode?: ExpandNode;
  public shape: RectShape;

  constructor(props: IGeneralizationNodeProps<DefaultNode, unknown>) {
    super({ ...props, nodeType: "node" });
    this.expandNode = undefined;
    this.shape = new RectShape({
      nodeData: this.nodeData,
      nodeStyle: this.style,
      group: this.group,
    });
  }

  public init(): void {
    throw new Error("Method not implemented.");
  }
}
