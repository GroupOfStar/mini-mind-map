import { LayoutNode } from "./../hierarchy/LayoutNode";
import { forScopeEachTree } from "src/utils";
import type { ILayoutOptions, IEdgeItem } from "./index.d";
import { WrapperdTree } from "../hierarchy/WrapperdTree";

const DEFAULT_OPTIONS: Required<ILayoutOptions> = {
  getId(item) {
    return item.id || item.name;
  },
  getName(item) {
    return item.name || " ";
  },
  getHGap(item) {
    return item.hGap || 0;
  },
  getVGap(item) {
    return item.vGap || 0;
  },
  getChildren(item) {
    return item.children || [];
  },
  getHeight(item) {
    return item.height || 0;
  },
  getWidth(item) {
    return item.width || this.getName(item).split("").length * 16;
  },
};

export abstract class Layout {
  nodeTree: LayoutNode;
  options: ILayoutOptions;
  extraEdges: IEdgeItem[];
  constructor(rootNode: any, options: Partial<ILayoutOptions>, extraEdges: IEdgeItem[] = []) {
    console.log("options :>> ", options);
    this.options = { ...DEFAULT_OPTIONS, ...(options || {}) };
    this.nodeTree = this.mapTree([rootNode])[0];
    this.extraEdges = extraEdges;
  }
  /** 布局 */
  abstract doLayout(): LayoutNode;
  /** 映射一个新的节点树数据 */
  mapTree(data: any[]): LayoutNode[] {
    return data.map((item) => {
      const children = this.options.getChildren(item);
      return new LayoutNode({
        id: this.options.getId(item),
        name: this.options.getName(item),
        hGap: this.options.getHGap(item),
        vGap: this.options.getVGap(item),
        children: Array.isArray(children) ? this.mapTree(children) : [],
      });
    });
  }
  /** 设置分层偏移量 */
  layer(node: LayoutNode, option: ILayoutOptions, isHorizontal: boolean, gap = 0) {
    const width = option.getWidth(node);
    const height = option.getHeight(node);
    // 水平方向
    if (isHorizontal) {
      node.x = gap;
      gap += width + node.hGap;
    } else {
      node.y = gap;
      gap += height + node.vGap;
    }
    node.children.forEach((child) => {
      this.layer(child, option, isHorizontal, gap);
    });
  }
  // 转换回
  convertBack(converted: WrapperdTree, root: LayoutNode, isHorizontal: boolean) {
    if (isHorizontal) {
      root.y = converted.y;
    } else {
      root.x = converted.y;
    }
    converted.children.forEach((child, i) => {
      this.convertBack(child, root.children[i], isHorizontal);
    });
  }

  /** 获取所有的节点 */
  getNodes() {
    const nodes: any[] = [];
    forScopeEachTree((node) => {
      const { x, y } = node;
      nodes.push({
        // origin data
        // nodeData: node.nodeData,
        // id: node.id,
        // position
        x,
        y,
        // centX: x + width / 2,
        // centY: y + height / 2,
        // // size
        // hGap,
        // vGap,
        // height,
        // width,
        // actualHeight: height - vGap * 2,
        // actualWidth: width - hGap * 2,
        // // depth
        // depth: node.depth,
      });
    }, this.nodeTree);
    return nodes;
  }
  /** 获取所有的线 */
  getEdges() {
    const extraEdges = this.extraEdges;
    const edges: IEdgeItem[] = [];
    forScopeEachTree((node) => {
      node.children.forEach((child) => {
        edges.push({
          source: node.id,
          target: child.id,
        });
      });
    }, this.nodeTree);
    edges.concat(extraEdges);
    return edges;
  }
}
