import { INodeTheme } from "./../style";

export interface INodeData {
  id: string;
  pid: "root" | string;
  depth?: number;
  text?: string;
  theme?: INodeTheme;
  children?: INodeData[];
  [key: string]: any;
}

// 所有事件类型
export type IEvents = {
  graph_click: Event;
  node_Click: string;
};
