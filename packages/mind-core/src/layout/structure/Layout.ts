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
  /** 获取所有的节点 */
  getNodes() {
    const nodes: any[] = [];
    this.rootNode.eachNode((node) => {
      const { x, y, width, height } = node.shape;
      const { marginX: hgap, marginY: vgap } = node.style;
      nodes.push({
        // origin data
        nodeData: node.nodeData,
        id: node.id,
        // position
        x,
        y,
        centX: x + width / 2,
        centY: y + height / 2,
        // size
        hgap,
        vgap,
        height,
        width,
        actualHeight: height - vgap * 2,
        actualWidth: width - hgap * 2,
        // depth
        depth: node.depth,
      });
    });
    return nodes;
  }
  /** 获取所有的线 */
  getEdges() {
    const extraEdges = this.extraEdges;
    const edges: IEdgeItem[] = [];
    this.rootNode.eachNode((node) => {
      node.children.forEach((child) => {
        edges.push({
          source: node.id,
          target: child.id,
        });
      });
    });
    edges.concat(extraEdges);
    return edges;
  }
}
