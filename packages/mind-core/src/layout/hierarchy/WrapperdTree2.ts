/** 布局节点 */
export class WrapperdTree2<T> {
  /** 是否水平布局 */
  static isHorizontal: boolean = true;
  /** 名称 */
  readonly name: string;
  /** 水平方向上的间距 */
  readonly hGap: number;
  /** 垂直方向上的间距 */
  readonly vGap: number;
  /** 宽度 */
  readonly width: number;
  /** 高度 */
  readonly height: number;
  /** X轴上的定位 */
  x = 0;
  /** Y轴上的定位 */
  y = 0;
  /** 父节点 */
  parentWt?: WrapperdTree2<T>;
  /** children数组 */
  readonly children: WrapperdTree2<T>[] = [];

  constructor(node: T, children: WrapperdTree2<T>[] = []) {
    const { text = "" } = node.nodeData;
    const { marginX, marginY } = node.style;
    this.name = text;
    this.hGap = marginX;
    this.vGap = marginY;

    const { x, y, height, width } = node.shape;
    if (WrapperdTree2.isHorizontal) {
      this.width = width;
      this.height = height;
      this.y = y;
    } else {
      this.width = height;
      this.height = width;
      this.y = x;
    }
    // 设置父节点
    children.forEach((item) => (item.parentWt = this));
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
      return Math.max(lastChild.y + lastChild.height, lastChild.contourBottom);
    } else {
      return this.y + this.height;
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
  /**
   * 从节点树创建布局节点树
   * @param node 节点树
   * @returns 布局节点树
   */
  static fromNode<T>(node: T): WrapperdTree2<T> {
    return new WrapperdTree2(
      node,
      node.children.map((item) => WrapperdTree2.fromNode(item))
    );
  }
  /**
   * 转换回
   * @param wt 布局后的节点树
   * @param root 传入的节点树
   */
  static convertBack<T>(wt: WrapperdTree2<T>, root: T) {
    if (WrapperdTree2.isHorizontal) {
      root.shape.x = wt.x;
      root.shape.y = wt.y;
    } else {
      root.shape.x = wt.y;
      root.shape.y = wt.x;
    }
    wt.children.forEach((child, i) => {
      WrapperdTree2.convertBack(child, root.children[i]);
    });
  }
}
