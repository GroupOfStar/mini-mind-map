import { RootNode, Node } from "src/node";
import { forDepthEachTree, forScopeEachTree, getScopeNodeList, nodeListForEach } from "src/utils";
import type { IForEachNode } from "src/utils/type.d";
import { Localization } from "./Localization";
import { Svg } from "@svgdotjs/svg.js";

// 按深度数和父节点进行节点分组
const getNodeMap = (rootNode: Node) => {
  const nodeMap = new Map<number, Node[]>();
  function loopMap(nodeTree: Node[], depth = 0) {
    const nodes = nodeMap.get(depth);
    if (nodes) {
      nodeMap.set(depth, nodes.concat(nodeTree));
    } else {
      nodeMap.set(depth, []);
    }
    if (nodeTree.some((item) => item.children.length > 0)) {
      nodeTree.forEach((item) => {
        if (item.children.length > 0) {
          loopMap(item.children, depth + 1);
        }
      });
    }
  }
  loopMap([rootNode]);

  return nodeMap;
};

export const layout = (rootNode: RootNode) => {
  // 设置 childAreaHeight
  forScopeEachTree(
    (current) => {
      const child = current.children;
      if (Array.isArray(child) && child.length > 0) {
        // 第一个子节点
        const marginY = child[0].style.marginY || 0;
        if (current.nodeData.text === "第二层节点02") {
          debugger;
        }
        current.childAreaHeight =
          child.reduce((pre, cur) => pre + cur.shape.height, 0) + (child.length - 1) * marginY;
      }
    },
    [rootNode]
  );

  /**
   * 处理子节点太多，导致重叠的现象
   * 方法：对层级后的节点的 childAreaHeight 之和，超出了当前层级节点的 childAreaHeight 之和的节点加上偏移量
   * 1. 按深度数和父节点进行节点分组
   * 2. 比较后，给节点添加偏移量
   */
  const nodeMap = getNodeMap(rootNode);
  console.log("nodeMap :>> ", nodeMap);
  nodeMap.forEach((item, index) => {
    // 不考虑根节点
    if (index !== 0) {
      // if (index === 1) {
      //   debugger;
      // }
      console.log("item :>> ", item);
      const currentDepthAreaTotal = item.reduce((pre, cur) => pre + cur.childAreaHeight, 0);
      const nextDepthAreaTotal =
        nodeMap.get(index + 1)?.reduce((pre, cur) => pre + cur.childAreaHeight, 0) || 0;
      if (currentDepthAreaTotal < nextDepthAreaTotal) {
        let count = item.length;
        // 奇数个节点，中间是不需要偏移的
        if (count % 2 !== 0) {
          count = count - 1;
        }
        const offset = (nextDepthAreaTotal - currentDepthAreaTotal) / count;
        item.forEach((node, index) => {
          // if (node.nodeData.text === "第3层节点02-01") {
          //   debugger;
          // }
          // if (Math.floor(item.length / 2) !== index) {
          // }
          node.shape.offsetY = offset;
        });
      }
    }
  });

  // 初步设置 y 的值
  forScopeEachTree(
    (current, index, prarentNode) => {
      // if (current.nodeData.text === "第3层节点02-01") {
      //   debugger;
      // }
      // 没有父节点那就是根节点
      if (prarentNode) {
        const { y, height } = prarentNode.shape;
        // 第一个节点
        if (index === 0) {
          current.shape.y = y + height / 2 - prarentNode.childAreaHeight / 2;
        } else {
          const prevChild = prarentNode.children[index - 1];
          const { y, height } = prevChild.shape;
          current.shape.y = y + height + (current.style.marginY || 0);
        }
        if (current.nodeData.text === "第二层节点02") {
          debugger;
        }
        // 取中间节点的index
        const middleIndex = Math.ceil(prarentNode.children.length / 2);
        // 假设5个节点，第3个不动，第1个要移动2*offset，第2个要移动1*offset
        // 如果是奇数个节点，中间节点不需要偏移
        if (!(prarentNode.children.length % 2 !== 0 && index === middleIndex)) {
          current.shape.y = current.shape.y + (index - middleIndex) * current.shape.offsetY;
        }
      } else {
        current.shape.y = window.innerHeight / 2;
        console.log("window.innerHeight / 2 :>> ", window.innerHeight / 2);
      }
    },
    [rootNode]
  );

  console.log("rootNode :>> ", rootNode);

  // 最后 计算x的位置并设置transform
  forScopeEachTree(
    (current, index, prarentNode) => {
      // 看是否是根节点
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
    },
    [rootNode]
  );
};
