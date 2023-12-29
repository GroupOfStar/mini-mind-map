import type { ILayoutNodePorps } from "../hierarchy/index.d";
import type { LayoutNode } from "../hierarchy/LayoutNode";

// type JSTypeMap = {
//   string: string;
//   boolean: boolean;
//   number: number;
//   function: Function;
//   object: object;
//   symbol: symbol;
//   undefined: undefined;
//   bigint: bigint;
// };
// type JSTypeName = keyof JSTypeMap;
// type ArgsType<T extends JSTypeName[]> = {
//   [I in keyof T]: JSTypeMap[T[I]];
// };

// type Watcher<T> = {
//  [key: `get${Capitalize<string & keyof T>}`](item: any) =>  T[keyof T];
// };

// type ILayoutOptions = Watcher<ILayoutNodePorps<LayoutNode>>;

// type Watcher<T> = {
//   on<K extends string & keyof T>(
//     eventName: `${K}Changed`,
//     callback: (oldValue: T[K], newValue: T[K]) => void
//   ): void;
// };

// declare function watch<T>(obj: T): Watcher<T>;

// const personWather = watch({
//   firstName: "Saoirse",
//   lastName: "Ronan",
//   age: 26
// });

// personWather.on("ageChanged", (oldValue, newValue) => {});

/** 布局配置 */
export interface ILayoutOptions {
  /** 获取id */
  getId: (item: any) => any;
  /** 获取id */
  getName: (item: any) => string;
  /** 水平方向间距 */
  getHGap: (item: any) => number;
  /** 垂直方向间距 */
  getVGap: (item: any) => number;
  /** 获取获取高度 */
  getHeight: (item: any) => number;
  /** 获取获取宽度 */
  getWidth: (item: any) => number;
  /** 获取子节点 */
  getChildren: (item: any) => any;
}

/** 连线配置 */
export interface IEdgeItem {
  source: any;
  target: any;
}
