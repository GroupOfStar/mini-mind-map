/** 树型节点 */
type ITreeNode<T extends Record<PropertyKey, any> = Record<PropertyKey, any>> = T & {
  children: ITreeNode<T>[];
};
