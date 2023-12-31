// 包装节点
export interface IWarpperNode<T> {
  current: T;
  index: number;
  parent?: T;
}

// 遍历节点
export type IForEachNode<T> = (node: T, index: number, parentNode?: T) => void;
