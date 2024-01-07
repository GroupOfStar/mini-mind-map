import { LayoutOption } from "../layout";

export type getEdgePoint = <T extends ITreeNode<{}>>(
  current: T,
  parentNode: T,
  isHorizontal: boolean,
  option: LayoutOption<T>
) => { beginX: number; beginY: number; endX: number; endY: number };

/**
 * 获取连线坐标点
 * @param current 当前节点
 * @param parentNode 父节点
 * @param isHorizontal 是否水平布局
 * @param option 参数配置
 */
export const getEdgePoint = function <T extends ITreeNode<{}>>(
  current: T,
  parentNode: T,
  isHorizontal: boolean,
  option: LayoutOption<T>
) {
  let beginNode: T;
  let endNode: T;
  let beginX: number;
  let beginY: number;
  let endX: number;
  let endY: number;

  const { getX, getY, getWidth, getHeight, getHOffset, getVOffset } = option;
  // 水平节点布局
  if (isHorizontal) {
    if (getX(current) > getX(parentNode)) {
      beginNode = current;
      endNode = parentNode;
    } else {
      beginNode = parentNode;
      endNode = current;
    }
    beginX = getX(beginNode) - getWidth(beginNode) / 2;
    beginY = getY(beginNode);

    endX = getX(endNode) + getWidth(endNode) / 2 - getHOffset(endNode);
    endY = getY(endNode);
  } else {
    if (getY(current) > getY(parentNode)) {
      beginNode = current;
      endNode = parentNode;
    } else {
      beginNode = parentNode;
      endNode = current;
    }
    beginX = getX(beginNode);
    beginY = getY(beginNode) - getHeight(beginNode) / 2;
    endX = getX(endNode);
    endY = getY(endNode) + getHeight(endNode) / 2 - getVOffset(endNode);
  }
  return { beginX, beginY, endX, endY };
};
