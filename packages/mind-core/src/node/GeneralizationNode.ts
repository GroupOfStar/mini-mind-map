import { Node } from "./Node";
import { DefaultNode } from "./DefaultNode";
import type { IGeneralizationNodeProps } from "./index.d";

export class GeneralizationNode extends Node<DefaultNode, unknown> {
  constructor(props: IGeneralizationNodeProps<DefaultNode, unknown>) {
    super({ ...props, nodeType: "node" });
  }
}
