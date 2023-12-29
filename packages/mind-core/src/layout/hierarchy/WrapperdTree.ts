import type { ILayoutOptions } from "../structure/index.d";
import type { LayoutNode } from "./LayoutNode";

export class WrapperdTree {
  // Width and height.
  w = 0;
  h = 0;
  x = 0;
  y = 0;
  prelim = 0;
  mod = 0;
  /** 水平方向间距 */
  hGap: number;
  /** 垂直方向间距 */
  vGap: number;

  /** 上线程 */
  tt: null | WrapperdTree = null;
  /** 下线程 */
  tb: null | WrapperdTree = null;

  /** children数组 */
  children: WrapperdTree[] = [];

  name: string = "";

  // constructor(name: string, w: number, h: number, y: number, children: WrapperdTree[] = []) {
  //   this.name = name;
  //   this.w = w;
  //   this.h = h;
  //   this.y = y;
  //   this.children = children;
  // }
  constructor(node: LayoutNode, option: ILayoutOptions, isHorizontal: boolean) {
    const children: WrapperdTree[] = [];

    this.hGap = option.getHGap(node);
    this.vGap = option.getVGap(node);
    const width = option.getWidth(node);
    const height = option.getHeight(node);

    node.children.forEach((child) => {
      const wrappedChild = new WrapperdTree(child, option, isHorizontal);
      if (wrappedChild) {
        children.push(wrappedChild);
      }
    });
    const { x, y, name } = node;
    this.name = name;
    this.children = children;
    if (isHorizontal) {
      this.w = width;
      this.h = height + (node.children.length > 1 ? this.vGap : 0);
      this.y = y;
    } else {
      this.w = height;
      this.h = width + (node.children.length > 1 ? this.hGap : 0);
      this.y = x;
    }
  }
  /** children的个数 */
  get cs() {
    return this.children.length;
  }
  // static fromNode(root: LayoutNode, isHorizontal: boolean, brotherlength: number = 1): WrapperdTree {
  //   const children: WrapperdTree[] = [];
  //   root.children.forEach((child, index, arr) => {
  //     const wrappedChild = WrapperdTree.fromNode(child, isHorizontal, arr.length);
  //     if (wrappedChild) {
  //       children.push(wrappedChild);
  //     }
  //   });
  //   const { x, y, height, width } = root.shape;
  //   const name = root.nodeData.text || "";
  //   if (isHorizontal) {
  //     return new WrapperdTree(
  //       name,
  //       width,
  //       height + (brotherlength > 1 ? root.style.marginY : 0),
  //       y,
  //       children
  //     );
  //   } else {
  //     return new WrapperdTree(
  //       name,
  //       height,
  //       width + (brotherlength > 1 ? root.style.marginX : 0),
  //       x,
  //       children
  //     );
  //   }
  // }
}
