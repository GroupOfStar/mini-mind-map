import type * as SVGType from "@svgdotjs/svg.js";
import type { Node } from "./Node";
import type { RootNode } from "./hierarchicalNode/RootNode";
import { SecondNode } from "./hierarchicalNode/SecondNode";
import { DefaultNode } from "./hierarchicalNode/DefaultNode";
import { GeneralizationNode } from "./hierarchicalNode/GeneralizationNode";
import type { INodeData, IEvents } from "./../graph/index.d";
import type { Emitter } from "../emitter/index.d";

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

export interface INodeProps<P, C> {
  nodeData: INodeData;
  nodeType: TNodeTypeOfKey;
  nodesGroup?: SVGType.G;
  parentNode?: Node<P, C>;
  emitter?: Emitter<IEvents>;
}

export type IRootNodeProps<P, C> = Pick<INodeProps<P, C>, "nodeData" | "nodesGroup" | "emitter">;

export type ISecondNodeProps<P, C> = Pick<
  INodeProps<P, C>,
  "nodeData" | "nodesGroup" | "parentNode" | "emitter"
>;

export type IDefaultNodeProps<P, C> = Pick<
  INodeProps<P, C>,
  "nodeData" | "nodesGroup" | "parentNode" | "emitter"
>;

export type IGeneralizationNodeProps<P, C> = Pick<
  INodeProps<P, C>,
  "nodeData" | "nodesGroup" | "parentNode" | "emitter"
>;
