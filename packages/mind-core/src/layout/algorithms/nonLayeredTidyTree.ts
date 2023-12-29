import { forScopeEachTree } from "src/utils";
import { WrapperdTree } from "../hierarchy";
import { LayoutNode } from "./../hierarchy/LayoutNode";

// 第二次遍历
function secondWalk(t: WrapperdTree) {
  forScopeEachTree((node, index, parentNode) => {
    node.mod = (parentNode?.mod || 0) + node.mod;
    node.y = node.prelim + node.mod;
  }, t);
}

// 获取节点底部的定位
function getBottom(wTree: WrapperdTree) {
  return wTree.y + wTree.h;
}

/**
 * 非分层归整树
 * @param root rootNode
 * @param isHorizontal 是否为水平方向
 * @returns 布局后的rootNode
 */
export const nonLayeredTidyTree = (root: LayoutNode, wt: WrapperdTree, isHorizontal: boolean) => {
  /**
   * 分离
   * @param prevChild 前一个子节点
   * @param currentChild 当前子节点
   */
  function separate(prevChild: WrapperdTree, currentChild: WrapperdTree) {
    /** 前一个节点 */
    let n1: null | WrapperdTree = prevChild;
    let n1ms = prevChild.mod;
    /** 当前节点 */
    let n2: null | WrapperdTree = currentChild;
    let n2ms = currentChild.mod;
    while (n1 != null && n2 != null) {
      const dist = n1ms + n1.prelim + n1.h - (n2ms + n2.prelim);
      if (dist > 0) {
        n2ms += dist;
        // 移动子树
        n2.mod += dist;
      }
      // 前一个节点的底部小于等于节点自己的底部位置
      if (getBottom(n1) <= getBottom(n2)) {
        // 下一个下轮廓
        if (n1.cs === 0) {
          n1 = n1.tb;
        } else {
          n1 = n1.children[n1.cs - 1];
          n1ms += n1.mod;
        }
      } else {
        // 下一个上轮廓
        if (n2.cs === 0) {
          n2 = n2.tt;
        } else {
          n2 = n2.children[0];
          n1ms += n2.mod;
        }
      }
    }
  }

  // 第一次遍历
  function firstWalk(wTree: WrapperdTree) {
    // 如果没有子节点
    if (wTree.cs !== 0) {
      const firstChild = wTree.children[0];
      const lastChild = wTree.children[wTree.cs - 1];
      firstWalk(firstChild);
      for (let i = 1; i < wTree.cs; ++i) {
        firstWalk(wTree.children[i]);
        separate(wTree.children[i - 1], wTree.children[i]);
      }
      // 设置根节点位置并计算子节点间的距离和位移差值
      wTree.prelim =
        (firstChild.prelim + firstChild.mod + lastChild.mod + lastChild.prelim + lastChild.h) / 2 -
        wTree.h / 2;
    }
  }

  // do layout
  // layer(root, isHorizontal);
  // const wt = WrapperdTree.fromNode(root, isHorizontal);
  firstWalk(wt);
  secondWalk(wt);

  return root;
};
