import type * as SVGType from "@svgdotjs/svg.js";
import type { RootNode } from "./hierarchicalNode/RootNode";
import { SecondNode } from "./hierarchicalNode/SecondNode";
import { DefaultNode } from "./hierarchicalNode/DefaultNode";
import { GeneralizationNode } from "./hierarchicalNode/GeneralizationNode";
import type { INodeData } from "./../graph/index.d";

/** 节点类型 */
export interface INodeType {
  root: RootNode;
  second: SecondNode;
  node: DefaultNode;
  generalization: GeneralizationNode;
}

/** 节点类型的key */
export type TNodeTypeOfKey = keyof INodeType;

/** 节点类型的value */
export type TNodeTypeOfValue = INodeType[TNodeTypeOfKey];

/** 节点树中的节点类型 */
export type ITypeOfNodeType = RootNode | SecondNode | DefaultNode;

export interface INodeProps<P, C, D> {
  nodeData: INodeData;
  currentNodeType: TNodeTypeOfKey;
  childNodeType: TNodeTypeOfKey;
  nodesGroup?: SVGType.G;
  parentNode?: P;
}

export type IRootNodeProps<P, C, D> = Pick<INodeProps<P, C, D>, "nodeData" | "nodesGroup">;

export type ISecondNodeProps<P, C, D> = Pick<
  INodeProps<P, C, D>,
  "nodeData" | "nodesGroup" | "parentNode"
>;

export type IDefaultNodeProps<P, C, D> = Pick<
  INodeProps<P, C, D>,
  "nodeData" | "nodesGroup" | "parentNode"
>;

export type IGeneralizationNodeProps<P, C, D> = Pick<
  INodeProps<P, C, D>,
  "nodeData" | "nodesGroup" | "parentNode"
>;
