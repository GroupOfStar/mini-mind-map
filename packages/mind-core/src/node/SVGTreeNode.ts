import type * as SVGType from "@svgdotjs/svg.js";

interface INodeBox {
  width?: number;
  height?: number;
}

export class SVGTreeNode {
  dom: SVGType.Element;
  nodeBox: INodeBox = {
    width: 0,
    height: 0
  };
  children: SVGTreeNode[] = [];
  constructor(dom: SVGType.Element) {
    this.dom = dom;
  }
  setNodeBox(nodeBox: INodeBox) {
    for (const [key, val] of Object.entries(nodeBox)) {
      this.nodeBox[key] = val || 0;
    }
  }
  private loopThisTree(
    callback: (item: SVGTreeNode) => void,
    treeNode: SVGTreeNode[] = [this]
  ) {
    for (let i = 0; i < treeNode.length; i++) {
      const item = treeNode[i];
      callback(item);
      if (Array.isArray(item.children)) {
        item.loopThisTree(callback, item.children);
      }
    }
  }
  setChildren(treeNode: SVGTreeNode[]) {
    for (let i = 0; i < treeNode.length; i++) {
      const item = treeNode[i];
      this.children.push(item);
      this.dom.add(item.dom);
    }
  }
}
