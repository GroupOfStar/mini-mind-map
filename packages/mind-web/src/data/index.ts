import { INodeData } from "@mini-mind-map/mind-core";
import { mindMapData, mindMapData2, mindMapData3 } from "./mindMapData";

/**
 * 通过一维的节点数组生成节点树数据
 * @param {INodeData[]} list 一维节点数组
 * @param {INodeData['pid']} rootPid 根节点的pid
 */
function getTreeNode(list: INodeData[], rootPid: INodeData["pid"]) {
  function treeLoop(listData: INodeData[], parentId: string, pDeep: number): INodeData[] {
    const children = listData.filter((item) => item.pid === parentId);
    if (children.length === 0) {
      return [];
    } else {
      return children.map((item) => ({
        ...item,
        name: item.text || "",
        deep: pDeep + 1,
        children: treeLoop(listData, item.id, pDeep + 1),
      }));
    }
  }

  const fidRoot = list.find((item) => item.pid === rootPid);
  if (fidRoot) {
    return [
      {
        ...fidRoot,
        name: fidRoot.text || "",
        deep: 0,
        children: treeLoop(list, fidRoot.id, 0),
      },
    ];
  } else {
    return [];
  }
}

/** 配置 */
export const config = mindMapData[0];

/** 节点list */
export const nodeList = mindMapData.slice(1) as INodeData[];

/** 节点树 */
export const nodeTree = getTreeNode(nodeList, config.id);
