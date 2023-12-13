import { Node } from "./Node";

export class WrappedTree {
  // Width and height.
  w = 0;
  h = 0;
  x = 0;
  y = 0;
  prelim = 0;
  mod = 0;
  shift = 0;
  change = 0;

  // Left and right thread.
  tl: null | WrappedTree = null;
  tr: null | WrappedTree = null;

  /** 最左边的节点 */
  el: null | WrappedTree = null;
  /** 最右边的节点 */
  er: null | WrappedTree = null;

  // Sum of modifiers at the extreme nodes.
  msel = 0;
  mser = 0;

  /** children数组 */
  c: WrappedTree[] = [];
  /** children的个数 */
  cs = 0;

  constructor(w: number, h: number, y: number, c: WrappedTree[] = []) {
    this.w = w;
    this.h = h;
    this.y = y;
    this.c = c;
    this.cs = c.length;
  }

  static fromNode(root: Node, isHorizontal: boolean): WrappedTree {
    const children: WrappedTree[] = [];
    root.children.forEach((child) => {
      const childTree = WrappedTree.fromNode(child, isHorizontal);
      if (childTree) {
        children.push(childTree);
      }
    });
    if (isHorizontal) {
      return new WrappedTree(root.height, root.width, root.x, children);
    } else {
      return new WrappedTree(root.width, root.height, root.y, children);
    }
  }
}
