import { Node } from "../Node";
import type { DefaultNode } from "./DefaultNode";
import type { ExpandNode } from "../contentNode/ExpandNode";
import type { IGeneralizationNodeProps } from "../index.d";

export class GeneralizationNode extends Node<DefaultNode, GeneralizationNode, never> {
  public expandNode?: ExpandNode;

  constructor(props: IGeneralizationNodeProps<DefaultNode, GeneralizationNode, never>) {
    super({ ...props, nodeType: "generalization" });
    this.expandNode = undefined;
  }
  public get children(): never[] {
    throw new Error("概要节点没有子节点。");
  }
  public set children(children: never[]) {
    throw new Error("概要节点没有子节点。");
  }
  public init(): void {
    // TODO
    throw new Error("Method not implemented.");
  }
  public addBrotherNode(): never {
    throw new Error("概要节点不能增加同级概要节点。");
  }
  public addChildNode(): never {
    throw new Error("概要节点不能增加子节点。");
  }
  public deleteActivatedNode(): never {
    // TODO
    throw new Error("Method not implemented.");
  }
}
