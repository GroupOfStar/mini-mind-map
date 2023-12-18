import type * as SVGType from "@svgdotjs/svg.js";
import type { Node } from "./Node";
import type { INodeData, IEvents } from "./../graph/index.d";
import type { INodeType } from "./../style";
import type { Emitter } from "../emitter/index.d";

export interface INodeProps {
  nodeData: INodeData;
  nodeType: INodeType;
  nodesGroup?: SVGType.G;
  parentNode?: Node;
  emitter?: Emitter<IEvents>;
}

export type IRootNodeProps = Pick<INodeProps, "nodeData" | "nodesGroup" | "emitter">;

export type ISecondNodeProps = Pick<
  INodeProps,
  "nodeData" | "nodesGroup" | "parentNode" | "emitter"
>;

export type IDefaultNodeProps = Pick<
  INodeProps,
  "nodeData" | "nodesGroup" | "parentNode" | "emitter"
>;
