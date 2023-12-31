import { INodeTheme } from "./../style";

export interface INodeData<T = unknown> extends ITreeNode<T> {
  id: string;
  pid: "root" | string;
  depth?: number;
  text?: string;
  theme?: INodeTheme;
  children: INodeData<T>[];
  [key: string]: any;
}

// 所有事件类型
export type IEvents = {
  graph_click: Event;
  node_Click: string;
};
