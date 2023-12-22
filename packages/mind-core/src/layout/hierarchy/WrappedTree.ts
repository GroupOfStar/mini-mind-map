import { Node } from "./../../node";

export class WrappedTree {
  // Width and height.
  w = 0;
  h = 0;
  x = 0;
  y = 0;
  prelim = 0;
  mod = 0;

  /** 上线程 */
  tt: null | WrappedTree = null;
  /** 下线程 */
  tb: null | WrappedTree = null;

  /** 第一个子节点 */
  nt: null | WrappedTree = null;
  /** 最后一个子节点 wTree.children[wTree.cs - 1].nb */
  nb: null | WrappedTree = null;

  /** children数组 */
  children: WrappedTree[] = [];

  name: string;

  constructor(name: string, w: number, h: number, y: number, children: WrappedTree[] = []) {
    this.name = name;
    this.w = w;
    this.h = h;
    this.y = y;
    this.children = children;
  }
  /** children的个数 */
  get cs() {
    return this.children.length;
  }
  static fromNode(root: Node, isHorizontal: boolean, brotherlength: number = 1): WrappedTree {
    const children: WrappedTree[] = [];
    root.children.forEach((child, index, arr) => {
      const childTree = WrappedTree.fromNode(child, isHorizontal, arr.length);
      if (childTree) {
        children.push(childTree);
      }
    });
    const { x, y, height, width } = root.shape;
    const name = root.nodeData.text || "";
    if (isHorizontal) {
      return new WrappedTree(
        name,
        height + (brotherlength > 1 ? root.style.marginY : 0),
        width,
        x,
        children
      );
    } else {
      return new WrappedTree(
        name,
        width + (brotherlength > 1 ? root.style.marginX : 0),
        height,
        y,
        children
      );
    }
  }
}
