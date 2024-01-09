import { Node } from "./Node";
import type { IRootNodeProps } from "./index.d";
import type { SecondNode } from "./index";

export class RootNode extends Node<null, SecondNode> {
  constructor(props: IRootNodeProps<null, SecondNode>) {
    super({ ...props, nodeType: "root" });
  }
}
