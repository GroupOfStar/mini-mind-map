import { Node } from "../Node";
import { DefaultNode } from "./DefaultNode";
import { ExpandNode } from "../contentNode/ExpandNode";
import type { IGeneralizationNodeProps } from "../index.d";

export class GeneralizationNode extends Node<DefaultNode, unknown> {
  public expandNode?: ExpandNode;

  constructor(props: IGeneralizationNodeProps<DefaultNode, unknown>) {
    super({ ...props, nodeType: "node" });
    this.expandNode = undefined;
  }
  public get children(): Node<unknown, unknown>[] {
    throw new Error("概要节点没有子节点。");
  }
  public set children(children: Node<unknown, unknown>[]) {
    throw new Error("概要节点没有子节点。");
  }
  public init(): void {
    throw new Error("Method not implemented.");
  }
}
