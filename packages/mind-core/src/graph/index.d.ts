import { INodeTheme } from "./../style";

export type INodeData = ITreeNode<{
  id: string;
  pid?: "root" | string;
  depth?: number;
  text?: string;
  theme?: INodeTheme;
}>;

// 所有事件类型
export type IEvents = {
  graph_click: Event;
  node_Click: string;
};
