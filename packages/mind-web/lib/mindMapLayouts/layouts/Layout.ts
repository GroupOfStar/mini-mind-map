import { Node, INodeItem, INodeOptions } from "./../hierarchy";

interface IEdgeItem {
  source: any;
  target: any;
}

export class Layout {
  root: Node;
  options: {};
  extraEdges: IEdgeItem[];
  constructor(
    root: INodeItem,
    options: INodeOptions = {},
    extraEdges: IEdgeItem[] = []
  ) {
    this.root = new Node(root, options);
    this.options = options;
    this.extraEdges = extraEdges;
  }

  doLayout() {
    throw new Error("please override this method");
  }

  getNodes() {
    const root = this.root;
    const nodes: any[] = [];
    root.eachNode(node => {
      nodes.push({
        // origin data
        data: node.data,
        id: node.id,
        // position
        x: node.x,
        y: node.y,
        centX: node.x + node.width / 2,
        centY: node.y + node.height / 2,
        // size
        hgap: node.hgap,
        vgap: node.vgap,
        height: node.height,
        width: node.width,
        actualHeight: node.height - node.vgap * 2,
        actualWidth: node.width - node.hgap * 2,
        // depth
        depth: node.depth
      });
    });
    return nodes;
  }

  getEdges() {
    const extraEdges = this.extraEdges;
    const root = this.root;
    const edges: IEdgeItem[] = [];
    root.eachNode(node => {
      node.children.forEach(child => {
        edges.push({
          source: node.id,
          target: child.id
        });
      });
    });
    edges.concat(extraEdges);
    return edges;
  }
}
