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

interface IEventArgs {
  event: Event;
  node: Node<TNodeTypeOfValue, TNodeTypeOfValue>;
}

// 组合键事件类型
interface ICompositeEvent extends Record<EventType, unknown> {
  /** 按住Ctrl键点击节点 */
  ctrl_node_click: Node<TNodeTypeOfValue, TNodeTypeOfValue>;
}

// 所有事件类型
export interface IEvents extends ICompositeEvent {
  graph_click: Event;
  graph_contextmenu: Event;
  node_click: Node<TNodeTypeOfValue, TNodeTypeOfValue>;
  node_dblclick: Node<TNodeTypeOfValue, TNodeTypeOfValue>;
  node_contextmenu: IEventArgs;
  expandNode_click: Event;
  addIcon_click: Event;
}
