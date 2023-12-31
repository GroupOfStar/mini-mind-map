import { forScopeEachTree } from "src/utils";
import { Node, RootNode } from "./../../node";

interface IEdgeItem {
  source: any;
  target: any;
}

export abstract class Layout {
  rootNode: RootNode;
  extraEdges: IEdgeItem[];
  constructor(rootNode: RootNode, extraEdges: IEdgeItem[] = []) {
    this.rootNode = rootNode;
    this.extraEdges = extraEdges;
  }
  /** 布局 */
  abstract doLayout(): Node;
  /** 获取节点树的边界框 */
  getBoundingBox() {
    const bb = {
      left: Number.MAX_VALUE,
      top: Number.MAX_VALUE,
      width: 0,
      height: 0,
    };
    forScopeEachTree<Node>((node) => {
      const { x, y, width, height } = node.shape;
      const { marginX, marginY } = node.style;
      bb.left = Math.min(bb.left, x);
      bb.top = Math.min(bb.top, y);
      bb.width = Math.max(bb.width, x + width + marginX);
      bb.height = Math.max(bb.height, y + height + marginY);
    }, this.rootNode);
    return bb;
  }
  /** 节点横坐标由右变成左 */
  right2left() {
    const bb = this.getBoundingBox();
    forScopeEachTree<Node>((node) => {
      const { x, width } = node.shape;
      const { marginX } = node.style;
      node.shape.x = x - (x - bb.left) * 2 - (width + marginX) + bb.width;
    }, this.rootNode);
  }
}
