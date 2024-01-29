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

/**
 * 拍平节点树
 * @param node 节点树
 * @returns 拍平后是节点数组
 */
export function flatTreeNode<T extends ITreeNode>(node: T): T[] {
  return node.children.reduce((total, item) => [...total, ...flatTreeNode(item)], [node]);
}

/**
 * 树节点数组的去重
 * @param nodes 树节点数组
 * @returns 去重后的树节点数组
 */
export function uniqueTreeNode<T extends ITreeNode>(nodes: T[]): T[] {
  // 判断是否存在互相存在的节点
  const isMutualExist = (curr: T, arr: T[]): boolean => {
    return arr.some((item) => (item.id === curr.id ? true : isMutualExist(curr, item.children)));
  };
  return nodes.reduce((total, currentValue) => {
    if (isMutualExist(currentValue, total)) {
      return total;
    } else {
      // 看total里的node有没有在currentValue中的，有就用删掉
      for (let index = 0; index < total.length; index++) {
        const ele = total[index];
        if (isMutualExist(ele, [currentValue])) {
          total.splice(index, 1);
          break;
        }
      }
      return [...total, currentValue];
    }
  }, [] as T[]);
}

// 把节点树的数组转换成文字树的数组
export function nodeTreeToTextTree<T extends ITreeNode>(nodes: T[]): string[] {
  return nodes.map((item) => {
    let text = "";
    let deep = 0;
    forScopeEachTree((node, index, parentNode) => {
      console.log("node :>> ", node);
      text += text.repeat(deep) + (node.nodeData.text || "");
      // .replace(/\n/g, "\\n");
      if (parentNode?.children.length === index + 1) {
        text += "\n";
        deep++;
      }
    }, item);
    return text;
  });
}
