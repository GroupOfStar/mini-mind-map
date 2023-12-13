import { Node, WrappedTree } from "../hierarchy";

interface IYL {
  /** 节点底部定位 */
  low?: number;
  index?: number;
  /** 上一个节点的YL */
  nxt?: IYL;
}

// 是否为数子类型
function isNumber(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// 设置节点位置
function moveRight(node: Node, move: number, isHorizontal: boolean) {
  if (isHorizontal) {
    node.y += move;
  } else {
    node.x += move;
  }
  node.children.forEach((child) => {
    moveRight(child, move, isHorizontal);
  });
}

// 获取方向的最小值
function getMin(node: Node, isHorizontal: boolean) {
  let res = isHorizontal ? node.y : node.x;
  node.children.forEach((child) => {
    res = Math.min(getMin(child, isHorizontal), res);
  });
  return res;
}

// 设置最大最小值
function normalize(node: Node, isHorizontal: boolean) {
  const min = getMin(node, isHorizontal);
  moveRight(node, -min, isHorizontal);
}

// 转换回
function convertBack(converted: WrappedTree, root: Node, isHorizontal: boolean) {
  if (isHorizontal) {
    root.y = converted.x;
  } else {
    root.x = converted.x;
  }
  converted.c.forEach((child, i) => {
    convertBack(child, root.children[i], isHorizontal);
  });
}

// 设置分层偏移量
function layer(node: Node, isHorizontal: boolean, d = 0) {
  // 水平方向
  if (isHorizontal) {
    node.x = d;
    d += node.width;
  } else {
    node.y = d;
    d += node.height;
  }
  node.children.forEach((child) => {
    layer(child, isHorizontal, d);
  });
}

/**
 * 非分层归整树
 * @param root rootNode
 * @param isHorizontal 是否为水平方向
 * @returns 布局后的rootNode
 */
export const nonLayeredTidyTree = (root: Node, isHorizontal: boolean) => {
  // 第一次遍历
  function firstWalk(wTree: WrappedTree) {
    if (wTree.cs === 0) {
      setExtremes(wTree);
    } else {
      firstWalk(wTree.c[0]);
      let ih = updateIYL(wTree.c[0].el ? bottom(wTree.c[0].el) : 0, 0, undefined);
      for (let i = 1; i < wTree.cs; ++i) {
        firstWalk(wTree.c[i]);
        const erTree = wTree.c[i].er;
        const min = erTree ? bottom(erTree) : 0;
        separate(wTree, i, ih);
        ih = updateIYL(min, i, ih);
      }
      positionRoot(wTree);
      setExtremes(wTree);
    }
  }

  // 设置极值
  function setExtremes(wTree: WrappedTree) {
    if (wTree.cs === 0) {
      wTree.el = wTree;
      wTree.er = wTree;
      wTree.msel = wTree.mser = 0;
    } else {
      wTree.el = wTree.c[0].el;
      wTree.er = wTree.c[wTree.cs - 1].er;
      wTree.msel = wTree.c[0].msel;
      wTree.mser = wTree.c[wTree.cs - 1].mser;
    }
  }

  /**
   * 分离
   * @param wTree 父节点的包装节点树
   * @param i 节点自己的index
   * @param ih 前一个节点的YL
   */
  function separate(wTree: WrappedTree, i: number, ih: IYL) {
    // 前一个节点
    let sr: null | WrappedTree = wTree.c[i - 1];
    let mssr = sr.mod;
    // 节点自己
    let cl: null | WrappedTree = wTree.c[i];
    let mscl = cl.mod;
    while (sr != null && cl != null) {
      const sy = bottom(sr);
      if (ih.low && sy > ih.low) {
        ih = ih.nxt || {};
      }
      const dist = mssr + sr.prelim + sr.w - (mscl + cl.prelim);
      if (dist > 0 && isNumber(ih.index)) {
        mscl += dist;
        moveSubtree(wTree, i, ih.index as number, dist);
      }
      // 前一个节点的底部小于等于节点自己的底部位置
      if (sy <= bottom(cl)) {
        sr = nextRightContour(sr);
        if (sr != null) mssr += sr.mod;
      } else {
        cl = nextLeftContour(cl);
        if (cl != null) mscl += cl.mod;
      }
    }
    if (!sr && !!cl) {
      setLeftThread(wTree, i, cl, mscl);
    } else if (!!sr && !cl) {
      setRightThread(wTree, i, sr, mssr);
    }
  }

  // 移动子树
  function moveSubtree(t: WrappedTree, i: number, si: number, dist: number) {
    t.c[i].mod += dist;
    t.c[i].msel += dist;
    t.c[i].mser += dist;
    distributeExtra(t, i, si, dist);
  }

  // 下一个左轮廓
  function nextLeftContour(wTree: WrappedTree) {
    return wTree.cs === 0 ? wTree.tl : wTree.c[0];
  }

  // 下一个右轮廓
  function nextRightContour(wTree: WrappedTree) {
    return wTree.cs === 0 ? wTree.tr : wTree.c[wTree.cs - 1];
  }

  // 获取节点底部的定位
  function bottom(wTree: WrappedTree) {
    return wTree.y + wTree.h;
  }

  // 设置左线程
  function setLeftThread(t: WrappedTree, i: number, cl: WrappedTree, modsumcl: number) {
    const li = t.c[0].el;
    if (li) {
      li.tl = cl;
      const diff = modsumcl - cl.mod - t.c[0].msel;
      li.mod += diff;
      li.prelim -= diff;
    }
    t.c[0].el = t.c[i].el;
    t.c[0].msel = t.c[i].msel;
  }

  // 设置右线程
  function setRightThread(t: WrappedTree, i: number, sr: WrappedTree, modsumsr: number) {
    const ri = t.c[i].er;
    if (ri) {
      ri.tr = sr;
      const diff = modsumsr - sr.mod - t.c[i].mser;
      ri.mod += diff;
      ri.prelim -= diff;
    }
    t.c[i].er = t.c[i - 1].er;
    t.c[i].mser = t.c[i - 1].mser;
  }

  // 设置根节点位置并计算子节点间距离并计算子节点模块和位移差值并计算子节点
  function positionRoot(t: WrappedTree) {
    t.prelim =
      (t.c[0].prelim + t.c[0].mod + t.c[t.cs - 1].mod + t.c[t.cs - 1].prelim + t.c[t.cs - 1].w) /
        2 -
      t.w / 2;
  }

  // 第二次遍历
  function secondWalk(t: WrappedTree, modsum: number) {
    modsum += t.mod;
    t.x = t.prelim + modsum;
    addChildSpacing(t);
    for (let i = 0; i < t.cs; i++) {
      secondWalk(t.c[i], modsum);
    }
  }

  // 分配额外空间
  function distributeExtra(t: WrappedTree, i: number, si: number, dist: number) {
    if (si !== i - 1) {
      const nr = i - si;
      t.c[si + 1].shift += dist / nr;
      t.c[i].shift -= dist / nr;
      t.c[i].change -= dist - dist / nr;
    }
  }

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

  // 位移差值
  function updateIYL(low: number, index: number, ih?: IYL): IYL {
    while (ih && ih.low && low >= ih.low) {
      ih = ih.nxt;
    }
    return {
      low,
      index,
      nxt: ih,
    };
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
