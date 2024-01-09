import { Node } from "./Node";
import type { RootNode } from "./index";
import type { DefaultNode } from "./DefaultNode";
import type { ISecondNodeProps } from "./index.d";

export class SecondNode extends Node<RootNode, DefaultNode> {
  constructor(props: ISecondNodeProps<RootNode, DefaultNode>) {
    super({ ...props, nodeType: "second" });
  }
}
