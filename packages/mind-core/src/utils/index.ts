import type { IForEachNode, IWarpperNode } from "./index.d";

/**
 * 防抖
 * @param fn 被防抖的函数
 * @param time 防抖间隔
 * @returns 被包装防抖后的函数
 */
export function debounce(fn: Function, time: number = 300) {
  let timer: NodeJS.Timeout | null = null;
  return function (this: object, ...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, time);
  };
}

/**
 * 广度优先
 * 遍历节点及子节点 by while
 * @param callback 遍历时执行的回调
 * @param node 当前节点
 */
export function forScopeEachTree<T extends ITreeNode<T>>(callback: IForEachNode<T>, node: T) {
  const nodeList: IWarpperNode<T>[] = [];
  const stack: IWarpperNode<T>[] = [{ current: node, index: 0 }];
  while (stack.length) {
    const item = stack.shift()!;
    nodeList.push(item);
    callback(item.current, item.index, item.parent);
    for (let i = 0; i < item.current.children.length; i++) {
      stack.push({
        current: item.current.children[i] as T,
        index: i,
        parent: item.current,
      });
    }
  }
}

/**
 * 深度遍历
 * 遍历节点及子节点 by while
 * @param callback 遍历时执行的回调
 * @param node 遍历的节点树
 */
export function forDeepEachTree<T extends ITreeNode<T>>(
  callback: IForEachNode<ITreeNode<T>>,
  node: T
) {
  const stack: IWarpperNode<ITreeNode<T>>[] = [{ current: node, index: 0 }];
  while (stack.length) {
    const item = stack.pop()!;
    callback(item.current, item.index, item.parent);
    for (let i = item.current.children.length - 1; i > -1; i--) {
      stack.push({
        current: item.current.children[i],
        index: i,
        parent: item.current,
      });
    }
  }
}
