import { forScopeEachTree } from "src/utils";

/** layout布局参数配置 */
export interface ILayoutOption<T extends ITreeNode<{}>> {
  /** 获取节点宽度 */
  getWidth(node: T): number;
  /** 获取节点高度 */
  getHeight(node: T): number;
  /** 获取水平方向上的间距 */
  getHGap(node: T): number;
  /** 获取垂直方向上的间距 */
  getVGap(node: T): number;

  /** 获取X轴的位置 */
  getX(node: T): number;
  /** 设置X轴的位置 */
  setX(node: T, value: number): void;
  /** 获取Y轴的位置 */
  getY(node: T): number;
  /** 设置Y轴的位置 */
  setY(node: T, value: number): void;
}

export abstract class Layout<T extends ITreeNode<{}>> {
  rootNode: T;
  option: ILayoutOption<T>;
  constructor(rootNode: T, option: ILayoutOption<T>) {
    this.rootNode = rootNode;
    this.option = option;
  }
  /** 布局 */
  abstract doLayout(): T;
  /** 获取节点树的边界框 */
  getBoundingBox(rootNode: T) {
    const bb = {
      left: Number.MAX_VALUE,
      top: Number.MAX_VALUE,
      width: 0,
      height: 0,
    };
    forScopeEachTree<T>((node) => {
      const { getX, getY, getWidth, getHeight, getVGap, getHGap, setX, setY } = this.option;
      const x = getX(node);
      const y = getY(node);
      // const width = getWidth(node);
      // const height = getHeight(node);

      bb.left = Math.min(bb.left, x);
      bb.top = Math.min(bb.top, y);
      // bb.width = Math.max(bb.width, x + width / 2);
      // bb.height = Math.max(bb.height, y + height / 2);
      bb.width = Math.max(bb.width, x);
      bb.height = Math.max(bb.height, y);
    }, rootNode);
    return bb;
  }
  /** 节点横坐标由右变成左 */
  right2left(rootNode: T, boundingBox: ReturnType<Layout<T>["getBoundingBox"]>) {
    forScopeEachTree<T>((node) => {
      const { getX, setX } = this.option;
      const x = getX(node);
      setX(node, -x + boundingBox.width);
    }, rootNode);
  }
  /** 节点纵坐标由下变成上 */
  down2up(rootNode: T, boundingBox: ReturnType<Layout<T>["getBoundingBox"]>) {
    forScopeEachTree((node) => {
      const { getY, setY } = this.option;
      const y = getY(node);
      setY(node, -y + boundingBox.height);
    }, rootNode);
  }
  /** 节点树整体偏移 */
  translate(rootNode: T, tx = 0, ty = 0) {
    forScopeEachTree<T>((node) => {
      const { getX, setX, getY, setY } = this.option;
      setX(node, getX(node) + tx);
      setY(node, getY(node) + ty);
    }, rootNode);
  }
}
