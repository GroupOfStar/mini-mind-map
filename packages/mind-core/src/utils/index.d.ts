// 包装节点
export interface IWarpperNode<T> {
  current: T;
  index: number;
  parent?: T;
}

// 遍历节点
export type IForEachNode<T> = (node: T, index: number, parentNode?: T) => void;

/** 字体配置 */
export interface IFontOption {
  size?: number;
  family?: string;
  italic?: string;
  bold?: string | number;
}
