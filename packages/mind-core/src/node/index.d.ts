import type * as SVGType from "@svgdotjs/svg.js";
import type { Node } from "./Node";
import type { INodeData, IEvents } from "./../graph/index.d";
import type { INodeType } from "./../style";
import type { Emitter } from "../emitter/index.d";

export interface INodeProps<P, C> {
  nodeData: INodeData;
  nodeType: INodeType;
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
