export interface ILayoutNodePorps<T> {
  id: any;
  name: string;
  width: number;
  height: number;
  /** 水平方向间距 */
  hGap: number;
  /** 垂直方向间距 */
  vGap: number;
  children: T[];
}
