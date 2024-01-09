/**
 * 深度获取子节点总数
 * @param node 节点数
 * @returns 子节点的总数
 */
export function getTreeNodeTotal<T extends ITreeNode>(node: T): number {
  return node.children.reduce(
    (total, item) => total + getTreeNodeTotal(item),
    node.children.length
  );
}

/**
 * 转换规范化可以使用在svgjs节点上的id
 * @param id node数据上的id
 * @returns 规范化的id
 */
export function normalNodeId(id: string | number) {
  return id.toString().trim().replace(/#|-/g, "");
}
