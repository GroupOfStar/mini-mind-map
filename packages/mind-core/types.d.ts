/** 树型节点 */
type ITreeNode<T> = {
  id?: PropertyKey;
  children: ITreeNode<T>[];
  [key: PropertyKey]: any;
};

// type ITreeNode<T = any> = {
//   id?: PropertyKey;
//   children: ITreeNode<T>[];
//   [key: PropertyKey]: any;
// } extends T;

// interface INode<T> {
//   id?: PropertyKey;
//   children: INode<T>[];
//   [key: PropertyKey]: any;
// }

// /** 树型节点 */
// type ITreeNode<T extends INode<T> = any> = INode<T> & T;
