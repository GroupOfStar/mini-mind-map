import { ILayoutOption } from "./Layout";

/** 布局节点 */
export class WrapperdTree<T extends ITreeNode<{}>> {
  /** 是否水平布局 */
  static isHorizontal: boolean = true;
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
  parentWt?: WrapperdTree<T>;
  /** children数组 */
  readonly children: WrapperdTree<T>[] = [];

  constructor(node: T, children: WrapperdTree<T>[] = [], layoutOption: ILayoutOption<T>) {
    const { getWidth, getHeight, getHGap, getVGap } = layoutOption;
    this.hGap = getHGap(node);
    this.vGap = getVGap(node);

    if (WrapperdTree.isHorizontal) {
      this.width = getWidth(node);
      this.height = getHeight(node);
    } else {
      this.width = getHeight(node);
      this.height = getWidth(node);
    }
    // 设置父节点
    children.forEach((item) => (item.parentWt = this));
    this.children = children;
  }
  /** children的个数 */
  get childCount() {
    return this.children.length;
  }
  /** 获取最后一个子节点 */
  get lastChild() {
    return this.children[this.children.length - 1];
  }
  /** 轮廓底部的定位 */
  get contourBottom() {
    if (this.children.length > 0) {
      const { y, height, contourBottom } = this.lastChild;
      return Math.max(y + height, contourBottom);
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
      return this.height;
    }
  }
  /** 轮廓中间位置 */
  get contourCenter() {
    if (this.children.length > 0) {
      const firstChild = this.children[0];
      return firstChild.y + this.contourHeight / 2;
    } else {
      return this.contourHeight / 2;
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
  /** 获取上一个同级轮廓节点 */
  getPrevSameLevelContour(deep: number = 0) {
    if (this.parentWt) {
      const getDeepNode = (pn: WrapperdTree<T>, d: number) => {
        return d > 1 ? getDeepNode(pn.lastChild, d - 1) : pn.lastChild;
      };
      const fid = this.parentWt.children.findIndex((item) => item === this);
      return fid > 0
        ? getDeepNode(this.parentWt.children[fid - 1], deep)
        : this.parentWt.getPrevSameLevelContour(deep + 1);
    } else {
      return undefined;
    }
  }
  /**
   * 从节点树创建布局节点树
   * @param node 节点树
   * @returns 布局节点树
   */
  static fromNode<T extends ITreeNode<{}>>(
    node: T,
    layoutOption: ILayoutOption<T>
  ): WrapperdTree<T> {
    return new WrapperdTree(
      node,
      node.children.map((item) => WrapperdTree.fromNode(item, layoutOption)),
      layoutOption
    );
  }
  /**
   * 转换回
   * @param wt 布局后的节点树
   * @param root 传入的节点树
   */
  static convertBack<T extends ITreeNode<{}>>(
    wt: WrapperdTree<T>,
    root: T,
    layoutOption: ILayoutOption<T>
  ) {
    const { setX, setY } = layoutOption;
    if (WrapperdTree.isHorizontal) {
      setX(root, wt.x);
      setY(root, wt.y);
    } else {
      setX(root, wt.y);
      setY(root, wt.x);
    }
    wt.children.forEach((child, i) => {
      WrapperdTree.convertBack(child, root.children[i], layoutOption);
    });
  }
}
