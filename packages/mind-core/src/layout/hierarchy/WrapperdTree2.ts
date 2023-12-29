import { Node } from "./../../node";

export class WrapperdTree2 {
  name: string;
  // Width and height.
  w = 0;
  h = 0;
  /** 水平方向上的间距 */
  hGap = 0;
  /** 垂直方向上的间距 */
  vGap = 0;
  x = 0;
  y = 0;
  /** 父节点 */
  parentWt?: WrapperdTree2;

  /** children数组 */
  children: WrapperdTree2[] = [];

  constructor(w: number, h: number, y: number, children: WrapperdTree2[] = [], node: Node) {
    this.name = node.nodeData.text || "";
    this.w = w;
    this.h = h;
    this.hGap = node.style.marginX;
    this.vGap = node.style.marginY;
    this.y = y;
    this.children = children;
  }
  /** children的个数 */
  get cs() {
    return this.children.length;
  }
  /** 轮廓底部的定位 */
  get contourBottom() {
    if (this.children.length > 0) {
      const lastChild = this.children[this.children.length - 1];
      return Math.max(lastChild.y + lastChild.h, lastChild.contourBottom);
    } else {
      return this.y + this.h;
    }
  }
  /** 轮廓高度 */
  get contourHeight() {
    if (this.children.length > 0) {
      const firstChild = this.children[0];
      return this.contourBottom - firstChild.y;
    } else {
      return 0;
    }
  }
  /** 轮廓中间位置 */
  get contourCenter() {
    if (this.children.length > 0) {
      const firstChild = this.children[0];
      return firstChild.y + this.contourHeight / 2;
    } else {
      return 0;
    }
  }
  /** 获取上一个轮廓 */
  get prevContour() {
    if (this.parentWt) {
      const fid = this.parentWt.children.findIndex((item) => item === this);
      return fid > 0 ? this.parentWt.children[fid - 1] : this.parentWt.prevContour;
    } else {
      return undefined;
    }
  }
  static fromNode(node: Node, isHorizontal: boolean): WrapperdTree2 {
    const children: WrapperdTree2[] = [];
    node.children.forEach((child, index, arr) => {
      const wrappedChild = WrapperdTree2.fromNode(child, isHorizontal);
      if (wrappedChild) {
        children.push(wrappedChild);
      }
    });
    const { x, y, height, width } = node.shape;
    if (isHorizontal) {
      return new WrapperdTree2(width, height, y, children, node);
    } else {
      return new WrapperdTree2(height, width, x, children, node);
    }
  }
}
