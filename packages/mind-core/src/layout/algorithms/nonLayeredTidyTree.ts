import { WrappedTree } from "../hierarchy";
import { Node } from "./../../node";

// 位移差值
class UpdateIYL {
  bottom: number;
  index: number;
  beforeNode?: UpdateIYL;
  constructor(bottom: number, index: number, beforeNode?: UpdateIYL) {
    while (beforeNode && beforeNode.bottom && bottom >= beforeNode.bottom) {
      beforeNode = beforeNode.beforeNode;
    }
    this.bottom = bottom;
    this.index = index;
    this.beforeNode = beforeNode;
  }
}

// 设置分层偏移量
function layer(node: Node, isHorizontal: boolean, d = 0) {
  const { marginX, marginY } = node.style;
  const { width, height } = node.shape;
  // 水平方向
  if (isHorizontal) {
    node.shape.x = d + marginX;
    d += width + marginX;
  } else {
    node.shape.y = d + marginY;
    d += height + marginY;
  }
  node.children.forEach((child) => {
    layer(child, isHorizontal, d);
  });
}

// 第二次遍历
function secondWalk(t: WrappedTree, modsum: number) {
  modsum += t.mod;
  t.x = t.prelim + modsum;
  // 添加子节点间距离并计算子节点模块和位移差值并计算子节点模块和位移差
  function addChildSpacing(t: WrappedTree) {
    let d = 0;
    let modsumdelta = 0;
    for (let i = 0; i < t.cs; i++) {
      d += t.c[i].shift;
      modsumdelta += d + t.c[i].change;
      t.c[i].mod += modsumdelta;
    }
  }
  addChildSpacing(t);
  for (let i = 0; i < t.cs; i++) {
    secondWalk(t.c[i], modsum);
  }
}

// 转换回
function convertBack(converted: WrappedTree, root: Node, isHorizontal: boolean) {
  if (isHorizontal) {
    root.shape.y = converted.x;
  } else {
    root.shape.x = converted.x;
  }
  converted.c.forEach((child, i) => {
    convertBack(child, root.children[i], isHorizontal);
  });
}

// 设置最大最小值
function normalize(node: Node, isHorizontal: boolean) {
  // 获取方向的最小值
  function getMin(node: Node, isHorizontal: boolean) {
    let res = isHorizontal ? node.shape.y : node.shape.x;
    node.children.forEach((child) => {
      res = Math.min(getMin(child, isHorizontal), res);
    });
    return res;
  }
  const min = getMin(node, isHorizontal);

  // 设置节点位置
  function moveRight(node: Node, move: number, isHorizontal: boolean) {
    if (isHorizontal) {
      node.shape.y += move;
    } else {
      node.shape.x += move;
    }
    node.children.forEach((child) => {
      moveRight(child, move, isHorizontal);
    });
  }
  moveRight(node, -min, isHorizontal);
}

// 获取节点底部的定位
function getBottom(wTree: WrappedTree) {
  return wTree.y + wTree.h;
}

/**
 * 非分层归整树
 * @param root rootNode
 * @param isHorizontal 是否为水平方向
 * @returns 布局后的rootNode
 */
export const nonLayeredTidyTree = (root: Node, isHorizontal: boolean) => {
  /**
   * 分离
   * @param wTree 父节点的包装节点树
   * @param i 节点自己的index
   * @param ih 前一个节点的YL
   */
  function separate(wTree: WrappedTree, i: number, ih: UpdateIYL) {
    /** 前一个节点 */
    let nbc: null | WrappedTree = wTree.c[i - 1];
    let mssr = nbc.mod;
    /** 当前节点 */
    let ncc: null | WrappedTree = wTree.c[i];
    let mscl = ncc.mod;
    while (nbc != null && ncc != null) {
      const sy = getBottom(nbc);
      if (ih.bottom !== 0 && sy > ih.bottom && ih.beforeNode) {
        ih = ih.beforeNode;
      }
      const dist = mssr + nbc.prelim + nbc.w - (mscl + ncc.prelim);
      if (dist > 0) {
        mscl += dist;
        // 移动子树
        ncc.mod += dist;
        ncc.msel += dist;
        ncc.mser += dist;
        // 分配额外空间
        if (ih.index !== i - 1) {
          console.log("tag");
          const nr = i - ih.index;
          wTree.c[ih.index + 1].shift += dist / nr;
          ncc.shift -= dist / nr;
          ncc.change -= dist - dist / nr;
        }
      }
      // 前一个节点的底部小于等于节点自己的底部位置
      if (sy <= getBottom(ncc)) {
        // 下一个右轮廓
        nbc = nbc.cs === 0 ? nbc.tb : nbc.c[nbc.cs - 1];
        if (nbc != null) mssr += nbc.mod;
      } else {
        // 下一个左轮廓
        ncc = ncc.cs === 0 ? ncc.tt : ncc.c[0];
        if (ncc != null) mscl += ncc.mod;
      }
    }
    if (!nbc && !!ncc) {
      // 设置上线程
      function setTopThread(nfc: WrappedTree, ncc: WrappedTree, i: number, modsumcl: number) {
        const li = nfc.nt;
        if (li) {
          li.tt = ncc;
          const diff = modsumcl - ncc.mod - nfc.msel;
          li.mod += diff;
          li.prelim -= diff;
        }
        nfc.nt = ncc.nt;
        nfc.msel = ncc.msel;
      }
      setTopThread(wTree.c[0], ncc, i, mscl);
    } else if (!!nbc && !ncc) {
      // 设置下线程
      function setBottomThread(t: WrappedTree, nbc: WrappedTree, i: number, modsumsr: number) {
        const ri = t.c[i].nb;
        if (ri) {
          ri.tb = nbc;
          const diff = modsumsr - nbc.mod - t.c[i].mser;
          ri.mod += diff;
          ri.prelim -= diff;
        }

        t.c[i].nb = t.c[i - 1].nb;
        t.c[i].mser = t.c[i - 1].mser;
      }
      setBottomThread(wTree, nbc, i, mssr);
    }
  }

  // 第一次遍历
  function firstWalk(wTree: WrappedTree) {
    // 如果没有子节点
    if (wTree.cs === 0) {
      // 设置极值
      wTree.nt = wTree;
      wTree.nb = wTree;
      wTree.msel = 0;
      wTree.mser = 0;
    } else {
      // 设置极值
      wTree.nt = wTree.c[0].nt;
      wTree.nb = wTree.c[wTree.cs - 1].nb;
      wTree.msel = wTree.c[0].msel;
      wTree.mser = wTree.c[wTree.cs - 1].mser;

      firstWalk(wTree.c[0]);
      // 位移差值
      let iyh = new UpdateIYL(wTree.nt ? getBottom(wTree.nt) : 0, 0);
      debugger;
      for (let i = 1; i < wTree.cs; ++i) {
        firstWalk(wTree.c[i]);
        separate(wTree, i, iyh);
        const erTree = wTree.c[i].nb;
        const min = erTree ? getBottom(erTree) : 0;
        iyh = new UpdateIYL(min, i, iyh);
      }
      console.log(wTree.name, "iyh :>> ", iyh);
      // 设置根节点位置并计算子节点间的距离和位移差值
      function positionRoot(t: WrappedTree) {
        t.prelim =
          (t.c[0].prelim +
            t.c[0].mod +
            t.c[t.cs - 1].mod +
            t.c[t.cs - 1].prelim +
            t.c[t.cs - 1].w) /
            2 -
          t.w / 2;
      }
      positionRoot(wTree);
    }
  }

  // do layout
  layer(root, isHorizontal);
  const wt = WrappedTree.fromNode(root, isHorizontal);
  firstWalk(wt);
  secondWalk(wt, 0);
  convertBack(wt, root, isHorizontal);
  normalize(root, isHorizontal);

  return root;
};
