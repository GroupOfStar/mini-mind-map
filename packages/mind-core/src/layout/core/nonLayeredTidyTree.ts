import { WrapperdTree } from "./WrapperdTree";

/**
 * 算法: 非分层归整树
 * @param root rootNode
 * @param isHorizontal 是否为水平方向
 * @returns 布局节点树
 */
export const nonLayeredTidyTree = <T extends ITreeNode<T>>(root: T, isHorizontal: boolean) => {
  /**
   * 循环深度遍历，设置节点的x,y
   * @param currentWt 当前节点
   * @param prevWt 上一个节点
   * @param parentWt 父节点
   */
  function walk(currentWt: WrapperdTree<T>, prevWt?: WrapperdTree<T>, parentWt?: WrapperdTree<T>) {
    // 水平方向
    const { x = 0, width = 0 } = parentWt || {};
    const { height: curHeight, hGap, vGap, childCount: curChildCount } = currentWt;
    currentWt.x = x + width + (WrapperdTree.isHorizontal ? hGap : vGap);
    const prevContour = currentWt.prevContour;
    if (prevContour) {
      currentWt.y = prevContour.contourBottom + vGap;
    }
    // 如果没有子节点
    const children = currentWt.children;
    children.forEach((item, index, arr) => walk(item, arr[index - 1], currentWt));
    if (prevWt) {
      if (curChildCount === 0) {
        currentWt.y = prevWt.contourBottom + vGap;
      } else {
        currentWt.y = currentWt.contourCenter - curHeight / 2;
      }
    } else {
      if (curChildCount === 1) {
        currentWt.y = currentWt.children[0].y;
      } else if (curChildCount > 1) {
        currentWt.y = currentWt.contourCenter - curHeight / 2;
      }
    }
  }

  WrapperdTree.isHorizontal = isHorizontal;
  // do layout
  const wt = WrapperdTree.fromNode(root);
  walk(wt);
  return wt;
};
