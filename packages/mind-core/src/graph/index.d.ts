import { EventType } from "src/emitter";
import { Node } from "./../node";
import type { TNodeTypeOfValue } from "./../node/index.d";
import { INodeTheme } from "./../style";

export type INodeData = ITreeNode<{
  id: string;
  pid?: "root" | string;
  depth?: number;
  text?: string;
  theme?: INodeTheme;
}>;

// 所有事件类型
export interface IEvents extends Record<EventType, unknown> {
  graph_click: Event;
  graph_contextmenu: Event;
  node_click: Node<TNodeTypeOfValue, TNodeTypeOfValue>;
  node_dblclick: Node<TNodeTypeOfValue, TNodeTypeOfValue>;
  node_contextmenu: Node<TNodeTypeOfValue, TNodeTypeOfValue>;
  expandNode_click: Event;
}
