import { WrapperdTree2 } from "../hierarchy";
import { Node } from "./../../node";

// 设置分层偏移量
function layer(wt: WrapperdTree2, isHorizontal: boolean, parentWt?: WrapperdTree2) {
  // 水平方向
  const { x = 0, y = 0, w = 0, h = 0 } = parentWt || {};
  if (isHorizontal) {
    wt.x = x + w + wt.hGap;
  } else {
    wt.y = y + h + wt.vGap;
  }
  wt.children.forEach((child) => {
    layer(child, isHorizontal, wt);
  });
}

// 第二次遍历
// function secondWalk(wt: WrapperdTree2) {
//   forScopeEachTree((node, index, parentNode) => {
//     node.mod = (parentNode?.mod || 0) + node.mod;
//     node.y = node.prelim + node.mod;
//   }, wt);
// }

// 转换回
function convertBack(converted: WrapperdTree2, root: Node, isHorizontal: boolean) {
  if (isHorizontal) {
    root.shape.x = converted.x;
    root.shape.y = converted.y;
  } else {
    root.shape.x = converted.y;
    root.shape.y = converted.x;
  }
  converted.children.forEach((child, i) => {
    convertBack(child, root.children[i], isHorizontal);
  });
}

/**
 * 非分层归整树
 * @param root rootNode
 * @param isHorizontal 是否为水平方向
 * @returns 布局后的rootNode
 */
export const nonLayeredTidyTree2 = (root: Node, isHorizontal: boolean) => {
  /**
   * 分离
   * @param wTree 父节点的包装节点树
   * @param i 节点自己的index
   * @param ih 前一个节点的YL
   */
  // function separate(prevChild: WrapperdTree2, currentChild: WrapperdTree2) {
  //   /** 前一个节点 */
  //   let n1: null | WrapperdTree2 = prevChild;
  //   let n1ms = prevChild.mod;
  //   /** 当前节点 */
  //   let n2: null | WrapperdTree2 = currentChild;
  //   let n2ms = currentChild.mod;
  //   while (n1 != null && n2 != null) {
  //     const dist = n1ms + n1.prelim + n1.h - (n2ms + n2.prelim);
  //     if (dist > 0) {
  //       n2ms += dist;
  //       // 移动子树
  //       n2.mod += dist;
  //     }
  //     // 下一个下轮廓
  //     if (n1.cs === 0) {
  //       n1 = n1.tb;
  //     } else {
  //       n1 = n1.children[n1.cs - 1];
  //       n1ms += n1.mod;
  //     }
  //   }
  // }

  function separate2(prevChild: WrapperdTree2, currentChild: WrapperdTree2) {
    currentChild.y = prevChild.y + prevChild.h + currentChild.vGap;
  }

  // 第一次遍历
  function firstWalk(currentWt: WrapperdTree2, prevWt?: WrapperdTree2, parentWt?: WrapperdTree2) {
    // 如果没有子节点
    if (currentWt.cs !== 0) {
      const children = currentWt.children;
      children.forEach((item, index, arr) => firstWalk(item, arr[index - 1], currentWt));
      for (let i = 1; i < currentWt.cs; ++i) {
        separate2(children[i - 1], children[i]);
      }
      const firstChild = children[0];
      // 设置根节点位置并计算子节点间的距离和位移差值
      // currentWt.y =
      //   (firstChild.y + firstChild.mod + lastChild.mod + lastChild.prelim + lastChild.h) / 2 -
      //   currentWt.h / 2;
      currentWt.y = firstChild.y + (currentWt.contourHeight - currentWt.h) / 2;
    }
    console.log("currentWt.name :>> ", currentWt.name);
    const dist = (prevWt?.contourBottom || 0) - currentWt.y + currentWt.vGap;
    if (dist > 0) {
      currentWt.y = currentWt.y + dist + currentWt.vGap;
    }
  }

  // 第一次遍历
  function firstWalk2(
    currentWt: WrapperdTree2,
    isHorizontal: boolean,
    prevWt?: WrapperdTree2,
    parentWt?: WrapperdTree2
  ) {
    currentWt.parentWt = parentWt;
    // 水平方向
    const { x = 0, y = 0, w = 0, h = 0 } = parentWt || {};
    if (isHorizontal) {
      currentWt.x = x + w + currentWt.hGap;
    } else {
      currentWt.y = y + h + currentWt.vGap;
    }
    const prevContour = currentWt.prevContour;
    if (prevContour) {
      currentWt.y = prevContour.contourBottom + currentWt.vGap;
    }
    // 如果没有子节点
    const children = currentWt.children;
    children.forEach((item, index, arr) =>
      firstWalk2(item, isHorizontal, arr[index - 1], currentWt)
    );
    if (prevWt) {
      if (currentWt.children.length === 0) {
        currentWt.y = prevWt.contourBottom + currentWt.vGap;
      } else {
        currentWt.y = currentWt.contourCenter - currentWt.h / 2;
      }
    } else {
      if (currentWt.children.length === 1) {
        const firstChild = currentWt.children[0];
        currentWt.y = firstChild.y + firstChild.h / 2 - currentWt.h / 2;
      } else if (currentWt.children.length > 1) {
        currentWt.y = currentWt.contourCenter - currentWt.h / 2;
      }
    }
  }

  // do layout
  const wt = WrapperdTree2.fromNode(root, isHorizontal);
  // layer(wt, isHorizontal);
  firstWalk2(wt, isHorizontal);
  // secondWalk(wt);
  convertBack(wt, root, isHorizontal);

  return root;
};
