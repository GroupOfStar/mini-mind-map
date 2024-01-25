import { Node } from "../Node";
import type { DefaultNode } from "./DefaultNode";
import type { ExpandNode } from "../contentNode/ExpandNode";
import type { IGeneralizationNodeProps } from "../index.d";

export class GeneralizationNode extends Node<DefaultNode, GeneralizationNode, never> {
  public expandNode?: ExpandNode;

  constructor(props: IGeneralizationNodeProps<DefaultNode, GeneralizationNode, never>) {
    super({ ...props, currentNodeType: "generalization", childNodeType: "generalization" });
    this.expandNode = undefined;
  }
  public get children(): never[] {
    throw new Error("概要节点没有子节点。");
  }
  public set children(children: never[]) {
    throw new Error("概要节点没有子节点。");
  }
  public init(): void {
    throw new Error("Method not implemented.");
  }
  public addChildNode(): never {
    throw new Error("概要节点不能增加子节点。");
  }
}
