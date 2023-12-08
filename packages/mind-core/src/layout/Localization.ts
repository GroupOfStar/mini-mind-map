import { RootNode, Node } from "src/node";

export class Localization {
  nodeList: Node[];
  lastNodeList: Node[] = [];

  constructor(nodeList: Node[]) {
    this.nodeList = nodeList;
  }

  // 从nodeList中提取最后的子节点
  getLastNode(): Node[] {
    const lastNodeList: Node[] = [];
    let i = 0;
    while (i < this.nodeList.length) {
      const child = this.nodeList[i].children;
      if (Array.isArray(child) && child.length > 0) {
        i++;
      } else {
        lastNodeList.push(this.nodeList.splice(i, 1)[0]);
        continue;
      }
    }
    this.lastNodeList = lastNodeList;
    return lastNodeList;
  }

  GroupByParentNode() {}
}
