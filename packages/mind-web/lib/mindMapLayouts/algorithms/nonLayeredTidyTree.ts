import { Node, WrappedTree } from "../hierarchy";

interface IYL {
  low?: number;
  index?: number;
  nxt?: IYL;
}
// node utils
function isNumber(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
function moveRight(node: Node, move: number, isHorizontal: boolean) {
  if (isHorizontal) {
    node.y += move;
  } else {
    node.x += move;
  }
  node.children.forEach(child => {
    moveRight(child, move, isHorizontal);
  });
}

function getMin(node: Node, isHorizontal: boolean) {
  let res = isHorizontal ? node.y : node.x;
  node.children.forEach(child => {
    res = Math.min(getMin(child, isHorizontal), res);
  });
  return res;
}

function normalize(node: Node, isHorizontal: boolean) {
  const min = getMin(node, isHorizontal);
  moveRight(node, -min, isHorizontal);
}

function convertBack(
  converted: WrappedTree,
  root: Node,
  isHorizontal: boolean
) {
  if (isHorizontal) {
    root.y = converted.x;
  } else {
    root.x = converted.x;
  }
  converted.c.forEach((child, i) => {
    convertBack(child, root.children[i], isHorizontal);
  });
}

function layer(node: Node, isHorizontal: boolean, d = 0) {
  if (isHorizontal) {
    node.x = d;
    d += node.width;
  } else {
    node.y = d;
    d += node.height;
  }
  node.children.forEach(child => {
    layer(child, isHorizontal, d);
  });
}

export const nonLayeredTidyTree = (root: Node, isHorizontal: boolean) => {
  function firstWalk(wTree: WrappedTree) {
    if (wTree.cs === 0) {
      setExtremes(wTree);
      return;
    }
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

  function setExtremes(wTree: WrappedTree) {
    if (wTree.cs === 0) {
      wTree.el = wTree;
      wTree.er = wTree;
      wTree.msel = wTree.mser = 0;
    } else {
      wTree.el = wTree.c[0].el;
      wTree.msel = wTree.c[0].msel;
      wTree.er = wTree.c[wTree.cs - 1].er;
      wTree.mser = wTree.c[wTree.cs - 1].mser;
    }
  }

  function separate(t: WrappedTree, i: number, ih: IYL) {
    let sr: null | WrappedTree = t.c[i - 1];
    let mssr = sr.mod;
    let cl: null | WrappedTree = t.c[i];
    let mscl = cl.mod;
    while (sr != null && cl != null) {
      if (ih.low && bottom(sr) > ih.low) ih = ih.nxt || {};
      const dist = mssr + sr.prelim + sr.w - (mscl + cl.prelim);
      if (dist > 0 && isNumber(ih.index)) {
        mscl += dist;
        moveSubtree(t, i, ih.index as number, dist);
      }
      const sy = bottom(sr);
      const cy = bottom(cl);
      if (sy <= cy) {
        sr = nextRightContour(sr);
        if (sr != null) mssr += sr.mod;
      }
      if (sy >= cy) {
        cl = nextLeftContour(cl);
        if (cl != null) mscl += cl.mod;
      }
    }
    if (!sr && !!cl) {
      setLeftThread(t, i, cl, mscl);
    } else if (!!sr && !cl) {
      setRightThread(t, i, sr, mssr);
    }
  }

  function moveSubtree(t: WrappedTree, i: number, si: number, dist: number) {
    t.c[i].mod += dist;
    t.c[i].msel += dist;
    t.c[i].mser += dist;
    distributeExtra(t, i, si, dist);
  }

  function nextLeftContour(t: WrappedTree) {
    return t.cs === 0 ? t.tl : t.c[0];
  }

  function nextRightContour(t: WrappedTree) {
    return t.cs === 0 ? t.tr : t.c[t.cs - 1];
  }

  function bottom(wTree: WrappedTree) {
    return wTree.y + wTree.h;
  }

  function setLeftThread(
    t: WrappedTree,
    i: number,
    cl: WrappedTree,
    modsumcl: number
  ) {
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

  function setRightThread(
    t: WrappedTree,
    i: number,
    sr: WrappedTree,
    modsumsr: number
  ) {
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

  function secondWalk(t: WrappedTree, modsum: number) {
    modsum += t.mod;
    t.x = t.prelim + modsum;
    addChildSpacing(t);
    for (let i = 0; i < t.cs; i++) {
      secondWalk(t.c[i], modsum);
    }
  }

  function distributeExtra(
    t: WrappedTree,
    i: number,
    si: number,
    dist: number
  ) {
    if (si !== i - 1) {
      const nr = i - si;
      t.c[si + 1].shift += dist / nr;
      t.c[i].shift -= dist / nr;
      t.c[i].change -= dist - dist / nr;
    }
  }

  function addChildSpacing(t: WrappedTree) {
    let d = 0;
    let modsumdelta = 0;
    for (let i = 0; i < t.cs; i++) {
      d += t.c[i].shift;
      modsumdelta += d + t.c[i].change;
      t.c[i].mod += modsumdelta;
    }
  }

  function updateIYL(low: number, index: number, ih?: IYL): IYL {
    while (ih && ih.low && low >= ih.low) {
      ih = ih.nxt;
    }
    return {
      low,
      index,
      nxt: ih
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
