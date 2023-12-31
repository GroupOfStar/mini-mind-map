/** 树型节点 */
type ITreeNode<T> = {
  id?: PropertyKey;
  children: ITreeNode<T>[];
  [key: PropertyKey]: any;
};
