import { LayoutOption } from "./Layout";
import { WrapperdTree } from "./WrapperdTree";

/**
 * 算法: 非分层归整树
 * @param root rootNode
 * @param isHorizontal 是否为水平方向
 * @returns 布局节点树
 */
export const nonLayeredTidyTree = <T extends ITreeNode<{}>>(
  root: T,
  isHorizontal: boolean,
  layoutOption: LayoutOption<T>
) => {
  /**
   * 循环深度遍历，设置节点的x,y
   * @param currentWt 当前节点
   * @param prevWt 上一个节点
   * @param parentWt 父节点
   */
  function walk(currentWt: WrapperdTree<T>, prevWt?: WrapperdTree<T>, parentWt?: WrapperdTree<T>) {
    // 水平方向
    const { x = 0, width = 0 } = parentWt || {};
    const { width: curWidth, height: curHeight, hGap, vGap, childCount: curChildCount } = currentWt;
    const gap = WrapperdTree.isHorizontal ? hGap : vGap;
    currentWt.x = x + width / 2 + gap + curWidth / 2;
    const prevContour = currentWt.prevContour;
    if (prevContour) {
      currentWt.y = prevContour.contourBottom + vGap;
    }
    currentWt.children.forEach((item, index, arr) => walk(item, arr[index - 1], currentWt));
    if (prevWt) {
      if (curChildCount === 0) {
        currentWt.y =
          prevWt.contourBottom +
          (prevWt.contourBottom - prevWt.y - prevWt.height > vGap ? 0 : vGap);
      } else if (curChildCount === 1) {
        if (WrapperdTree.isHorizontal) {
          currentWt.y = currentWt.contourCenter - curHeight / 2;
        } else {
          currentWt.y = currentWt.children[0].y;
        }
      } else if (curChildCount > 1) {
        currentWt.y = currentWt.contourCenter - curHeight / 2;
      }
    } else {
      if (curChildCount === 0) {
        // 上一个同级轮廓节点
        const prevSameLevelNode = currentWt.getPrevSameLevelContour();
        if (prevSameLevelNode) {
          const { contourBottom, y, height } = prevSameLevelNode;
          currentWt.y = contourBottom + (contourBottom - y - height > vGap ? 0 : vGap);
        } else {
          currentWt.y = currentWt.y;
        }
      } else if (curChildCount === 1) {
        if (WrapperdTree.isHorizontal) {
          currentWt.y = currentWt.contourCenter - curHeight / 2;
        } else {
          currentWt.y = currentWt.children[0].y;
        }
      } else if (curChildCount > 1) {
        currentWt.y = currentWt.contourCenter - curHeight / 2;
      }
    }
  }

  WrapperdTree.isHorizontal = isHorizontal;
  // do layout
  const wt = WrapperdTree.fromNode(root, layoutOption);
  walk(wt);
  return wt;
};
