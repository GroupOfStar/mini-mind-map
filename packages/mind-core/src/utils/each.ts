import type { IForEachNode, IWarpperNode } from "./index.d";

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

/**
 * 深度获取子节点总数
 * @param node 节点数
 * @returns 子节点的总数
 */
export function getTreeNodeTotal<T extends ITreeNode>(node: T): number {
  return node.children.reduce(
    (total, item) => total + getTreeNodeTotal(item),
    node.children.length
  );
}
