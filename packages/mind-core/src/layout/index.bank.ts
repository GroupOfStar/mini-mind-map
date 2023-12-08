import { RootNode, Node } from "src/node";
import { forDepthEachTree, getScopeNodeList, nodeListForEach } from "src/utils";
import type { IForEachNode } from "src/utils/type.d";
import { Localization } from "./Localization";
import { Svg } from "@svgdotjs/svg.js";

// 获取节点的最大深度数
const getMaxDepthByNodeTree = (rootNode: RootNode) => {
  return 6;
};

// 按深度数和父节点进行节点分组
const getNodeMap = (nodeList: Node[], maxDepth: number) => {
  const nodeMap = new Map<number, Record<string, Node[]>>();
  for (let i = 0; i < maxDepth; i++) {
    const depthGroup = nodeList.filter((item) => item.deep === i);
    // 按父一节点进行节点分组
    const nodesGroup: Record<string, Node[]> = {};
    depthGroup.forEach((item) => {
      const pid = item.nodeData.pid;
      if (nodesGroup[pid]) {
        nodesGroup[pid].push(item);
      } else {
        nodesGroup[pid] = [item];
      }
    });
    nodeMap.set(i, nodesGroup);
  }
  return nodeMap;
};

// 先设置最后子节点Y的值
function setLastNodesY(nodeList: Node[]) {
  const lastNodes = nodeList.filter(
    (item) => !(Array.isArray(item.children) && item.children.length > 0)
  );
  let top = 0;
  lastNodes.forEach((item) => {
    item.shape.y = top;
    top += item.shape.height + (item.style.marginY || 0);
  });
  console.log("lastNodes :>> ", lastNodes);
}

// 从深往浅设置节点的childAreaHeight
function setchildAreaHeight(
  nodeList: Node[],
  nodeMap: Map<number, Record<string, Node[]>>,
  maxDepth: number
) {
  for (let i = maxDepth - 1; i >= 0; i--) {
    const nodesGroup = nodeMap.get(i);
    if (nodesGroup) {
      for (const [pid, child] of Object.entries(nodesGroup)) {
        const fid = nodeList.find((ele) => ele.nodeData.id === pid);
        if (fid) {
          // 第一个子节点
          const firstChild = child[0];
          const marginY = firstChild.style.marginY || 0;
          const childAreaHeight =
            child.reduce((pre, cur) => pre + cur.shape.height, 0) + (child.length - 1) * marginY;
          fid.childAreaHeight = childAreaHeight;
          fid.shape.y = firstChild.shape.y + childAreaHeight / 2 - fid.shape.height / 2;
        }

        if (fid?.nodeData.text === "第5层节点01-01-01-01") {
          console.log("child :>> ", child);
          console.log("child[0] :>> ", child[0]);
          console.log("fid.childAreaHeight >>:", fid.childAreaHeight);
          console.log("fid.shape.y :>> ", fid.shape.y);
        }
      }
    }
  }
}

export const layout = (rootNode: RootNode) => {
  // 获取节点的最大深度数
  const maxDepth = getMaxDepthByNodeTree(rootNode);

  // 扁平化treeNode
  const nodeList = getScopeNodeList(rootNode);
  console.log("nodeList :>> ", nodeList);

  // 先设置最后子节点Y的值
  setLastNodesY(nodeList);

  // 按深度数和父节点进行节点分组
  const nodeMap = getNodeMap(nodeList, maxDepth);

  // 从深往根设置节点的childAreaHeight和top
  setchildAreaHeight(nodeList, nodeMap, maxDepth);

  // // 计算y的位置并设置transform
  // nodeListForEach(nodeList, (current, index, prarentNode) => {
  //   // console.log("prarentNode. :>> ", prarentNode?.nodeData.text);
  //   // console.log("current. :>> ", current.nodeData.text);
  //   if(current.nodeData.deep === 0) {
  //     current.shape.y = window.innerHeight / 2
  //   } else if (prarentNode) {
  //     // current.shape.y = x + width + (current.style.marginX || 0);
  //   }
  // });
  console.log("nodeList :>> ", nodeList);

  // 最后 计算x的位置并设置transform
  nodeListForEach(nodeList, (current, index, prarentNode) => {
    // console.log("prarentNode. :>> ", prarentNode?.nodeData.text);
    // console.log("current. :>> ", current.nodeData.text);
    if (prarentNode) {
      const { x, width } = prarentNode.shape;
      current.shape.x = x + width + (current.style.marginX || 0);
    }
    current.group.transform({
      rotate: 0,
      translateX: current.shape.x,
      translateY: current.shape.y,
      scale: 1,
    });
  });
};
