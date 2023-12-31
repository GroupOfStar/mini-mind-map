import { WrapperdTree2 } from "../hierarchy";
import { Node } from "./../../node";

/**
 * 非分层归整树
 * @param root rootNode
 * @param isHorizontal 是否为水平方向
 * @returns 布局节点树
 */
export const nonLayeredTidyTree2 = <T>(root: T, isHorizontal: boolean) => {
  /**
   * 循环深度遍历，设置节点的x,y
   * @param currentWt 当前节点
   * @param prevWt 上一个节点
   * @param parentWt 父节点
   */
  function walk(
    currentWt: WrapperdTree2<T>,
    prevWt?: WrapperdTree2<T>,
    parentWt?: WrapperdTree2<T>
  ) {
    // 水平方向
    const { x = 0, y = 0, width = 0, height = 0 } = parentWt || {};
    if (WrapperdTree2.isHorizontal) {
      currentWt.x = x + width + currentWt.hGap;
    } else {
      currentWt.y = y + height + currentWt.vGap;
    }
    const prevContour = currentWt.prevContour;
    if (prevContour) {
      currentWt.y = prevContour.contourBottom + currentWt.vGap;
    }
    // 如果没有子节点
    const children = currentWt.children;
    children.forEach((item, index, arr) => walk(item, arr[index - 1], currentWt));
    if (prevWt) {
      if (currentWt.children.length === 0) {
        currentWt.y = prevWt.contourBottom + currentWt.vGap;
      } else {
        currentWt.y = currentWt.contourCenter - currentWt.height / 2;
      }
    } else {
      if (currentWt.children.length === 1) {
        const firstChild = currentWt.children[0];
        currentWt.y = firstChild.y + firstChild.height / 2 - currentWt.height / 2;
      } else if (currentWt.children.length > 1) {
        currentWt.y = currentWt.contourCenter - currentWt.height / 2;
      }
    }
  }

  WrapperdTree2.isHorizontal = isHorizontal;
  // do layout
  const wt = WrapperdTree2.fromNode(root);
  walk(wt);
  return wt;
};
