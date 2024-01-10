import { ILayoutOption } from "../layout";

export type getEdgePoint = <T extends ITreeNode<{}>>(
  current: T,
  parentNode: T,
  isHorizontal: boolean,
  option: ILayoutOption<T>
) => { beginX: number; beginY: number; endX: number; endY: number };

/** 连线偏移配置 */
export interface IEdgeOffsetOption<T extends ITreeNode<{}>> {
  /** 获取前方侧的偏移量 */
  getFrontSideOffset(node: T): number;
  /** 获取按钮侧的偏移量 */
  getBtnSideOffset(node: T): number;
}

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
  option: ILayoutOption<T> & IEdgeOffsetOption<T>
) {
  let beginNode: T;
  let endNode: T;
  let beginX: number;
  let beginY: number;
  let endX: number;
  let endY: number;

  const { getX, getY, getWidth, getHeight, getFrontSideOffset, getBtnSideOffset } = option;
  // 水平节点布局
  if (isHorizontal) {
    if (getX(current) > getX(parentNode)) {
      beginNode = current;
      endNode = parentNode;
    } else {
      beginNode = parentNode;
      endNode = current;
    }
    beginX = getX(beginNode) - getWidth(beginNode) / 2 + getFrontSideOffset(beginNode);
    beginY = getY(beginNode);

    endX = getX(endNode) + getWidth(endNode) / 2 - getBtnSideOffset(endNode);
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
    beginY = getY(beginNode) - getHeight(beginNode) / 2 - getFrontSideOffset(beginNode);
    endX = getX(endNode);
    endY = getY(endNode) + getHeight(endNode) / 2 - getBtnSideOffset(endNode);
  }
  return { beginX, beginY, endX, endY };
};
