import type { IForEachNode, IWarpperNode } from "./index.d";

/**
 * 深度先序遍历树得到新的数据
 * @param callback 遍历时执行的回调
 * @param dataTree 节点树
 * @returns 遍历后的节点树
 */
export function mapTree<T extends ITreeNode>(
  callback: (nodeData: T, index: number, parentNode?: T) => T,
  dataTree: T[]
): any[] {
  function walk(data: T[], parentNode?: T) {
    return data.map((item, index) => {
      const node = callback(item, index, parentNode);
      return {
        ...node,
        children: walk(item.children, node),
      };
    });
  }
  return walk(dataTree);
}

/**
 * 广度优先
 * 遍历节点及子节点 by while
 * @param callback 遍历时执行的回调
 * @param node 当前节点
 */
export function forScopeEachTree<T extends ITreeNode>(callback: IForEachNode<T>, node: T) {
  const nodeList: IWarpperNode<T>[] = [];
  const stack: IWarpperNode<T>[] = [{ current: node, index: 0 }];
  while (stack.length) {
    const item = stack.shift()!;
    nodeList.push(item);
    callback(item.current, item.index, item.parent);
    for (let i = 0; i < item.current.children.length; i++) {
      stack.push({
        current: item.current.children[i],
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
export function forDeepEachTree<T extends ITreeNode>(callback: IForEachNode<T>, node: T) {
  const stack: IWarpperNode<T>[] = [{ current: node, index: 0 }];
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
