import { Node } from "./../../node";

export class WrapperdTree {
  // Width and height.
  w = 0;
  h = 0;
  x = 0;
  y = 0;
  prelim = 0;
  mod = 0;

  /** 上线程 */
  tt: null | WrapperdTree = null;
  /** 下线程 */
  tb: null | WrapperdTree = null;

  /** children数组 */
  children: WrapperdTree[] = [];

  name: string;

  constructor(name: string, w: number, h: number, y: number, children: WrapperdTree[] = []) {
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
  static fromNode(root: Node, isHorizontal: boolean, brotherlength: number = 1): WrapperdTree {
    const children: WrapperdTree[] = [];
    root.children.forEach((child, index, arr) => {
      const wrappedChild = WrapperdTree.fromNode(child, isHorizontal, arr.length);
      if (wrappedChild) {
        children.push(wrappedChild);
      }
    });
    const { x, y, height, width } = root.shape;
    const name = root.nodeData.text || "";
    if (isHorizontal) {
      return new WrapperdTree(
        name,
        width,
        height + (brotherlength > 1 ? root.style.marginY : 0),
        y,
        children
      );
    } else {
      return new WrapperdTree(
        name,
        height,
        width + (brotherlength > 1 ? root.style.marginX : 0),
        x,
        children
      );
    }
  }
}
