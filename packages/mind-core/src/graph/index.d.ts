import { EventType } from "src/emitter";
import { Node, SecondNode, DefaultNode } from "./../node";
import type { ITypeOfNodeType } from "./../node/index.d";
import { INodeTheme } from "./../style";

export type INodeData = ITreeNode<{
  id: string;
  pid?: "root" | string;
  depth?: number;
  text?: string;
  theme?: INodeTheme;
}>;

type IUniversalNode = Node<ITypeOfNodeType | never, ITypeOfNodeType, SecondNode | DefaultNode>;

interface IEventArgs {
  event: Event;
  node: IUniversalNode;
}

// 组合键事件类型
interface ICompositeEvent extends Record<EventType, unknown> {
  /** 按住Ctrl键点击节点 */
  ctrl_node_click: IUniversalNode;
}

// 所有事件类型
export interface IEvents extends ICompositeEvent {
  graph_click: Event;
  graph_contextmenu: Event;
  node_click: IUniversalNode;
  node_dblclick: IUniversalNode;
  node_contextmenu: IEventArgs;
  expandNode_click: Event;
  addIcon_click: IUniversalNode;
}
