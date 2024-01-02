import { forScopeEachTree } from "src/utils";

export abstract class Layout<T extends ITreeNode<T>> {
  rootNode: T;
  constructor(rootNode: T) {
    this.rootNode = rootNode;
  }
  /** 布局 */
  abstract doLayout(): T;
  /** 获取节点树的边界框 */
  getBoundingBox<T extends ITreeNode<T>>(rootNode: T) {
    const bb = {
      left: Number.MAX_VALUE,
      top: Number.MAX_VALUE,
      width: 0,
      height: 0,
    };
    forScopeEachTree<T>((node) => {
      const { x, y, width, height } = node.shape;
      bb.left = Math.min(bb.left, x);
      bb.top = Math.min(bb.top, y);
      bb.width = Math.max(bb.width, x + width / 2);
      bb.height = Math.max(bb.height, y + height / 2);
    }, rootNode);
    return bb;
  }
  /** 节点横坐标由右变成左 */
  right2left<T extends ITreeNode<T>>(
    rootNode: T,
    boundingBox: ReturnType<Layout<T>["getBoundingBox"]>
  ) {
    forScopeEachTree<T>((node) => {
      const { x } = node.shape;
      node.shape.x = -x + boundingBox.width;
    }, rootNode);
  }
  /** 节点纵坐标由下变成上 */
  down2up<T extends ITreeNode<T>>(
    rootNode: T,
    boundingBox: ReturnType<Layout<T>["getBoundingBox"]>
  ) {
    forScopeEachTree((node) => {
      const { y } = node.shape;
      node.shape.y = -y + boundingBox.height;
    }, rootNode);
  }
  /** 节点树整体偏移 */
  translate<T extends ITreeNode<T>>(rootNode: T, tx = 0, ty = 0) {
    forScopeEachTree<T>((node) => {
      node.shape.x += tx;
      node.shape.y += ty;
    }, rootNode);
  }
}
