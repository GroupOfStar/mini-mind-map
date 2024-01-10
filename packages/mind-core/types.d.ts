/** 树型节点 */
type ITreeNode<T extends Record<PropertyKey, any> = Record<PropertyKey, any>> = T & {
  children: ITreeNode<T>[];
};

/** 提取数组元素的类型 */
type ArrElementType<T> = T extends (infer U)[] ? U : never;
