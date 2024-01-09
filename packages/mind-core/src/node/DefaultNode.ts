import { Node } from "./Node";
import type { SecondNode } from "./SecondNode";
import type { IDefaultNodeProps } from "./index.d";

export class DefaultNode extends Node<SecondNode | DefaultNode, DefaultNode> {
  constructor(props: IDefaultNodeProps<SecondNode | DefaultNode, DefaultNode>) {
    super({ ...props, nodeType: "node" });
  }
}
