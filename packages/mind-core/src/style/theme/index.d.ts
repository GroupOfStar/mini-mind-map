export interface INodeTheme {
  /** 节点字体 */
  fontFamily?: string;
  /** 节点横向边距 */
  paddingX?: number;
  /** 节点纵向边距 */
  paddingY?: number;
  /** 节点形状 */
  shape?: string;
  /** 节点横向间距  */
  marginX?: number;
  /** 节点纵向间距 */
  marginY?: number;
  /** 节点填充颜色 */
  fillColor?: string;
  /** 节点字体粗细 */
  fontWeight?: number | string;
  /** 节点字体大小 */
  fontSize?: number;
  /** 节点字体颜色 */
  color?: string;
  /** 节点字体样式 */
  fontStyle?: string;
  lineHeight?: number;
  /** 连线的粗细 */
  lineWidth?: number;
  /** 连线的颜色 */
  lineColor?: string;
  /** 连线样式 */
  lineDasharray?: string;
  /** 边框颜色 */
  borderColor?: string;
  /** 边框宽度 */
  borderWidth?: number;
  /** 边框样式 */
  borderDasharray?: string;
  /** 边框圆角 */
  borderRadius?: number;
  /** 边框透明度 */
  textDecoration?: string;
  /** 选中状态样式 */
  active?: {
    /** 选中状态的边框样式 */
    borderDasharray?: string;
    /** 选中状态的边框颜色 */
    rectBorder?: string;
  };
}

export interface IDefaultTheme {
  /** 图片显示的最大宽度 */
  imgMaxWidth?: number;
  /** 图片显示的最大高度 */
  imgMaxHeight?: number;
  /** icon的大小 */
  iconSize?: number;
  /** 连线的粗细 */
  lineWidth?: number;
  /** 连线的颜色 */
  lineColor?: string;
  /** 连线样式 */
  lineDasharray?: string;
  /**
   * 连线风格, 针对logicalStructure、mindMap两种结构
   * 曲线(curve), 直线(straight), 直连(direct)
   */
  lineStyle?: "curve" | "straight" | "direct";
  /** 概要连线的粗细 */
  generalizationLineWidth?: number;
  /** 概要连线的颜色 */
  generalizationLineColor?: string;
  /** 概要曲线距节点的距离 */
  generalizationLineMargin?: number;
  /** 概要节点距节点的距离 */
  generalizationNodeMargin?: number;
  /** 背景颜色 */
  backgroundColor?: string;
  /** 背景图片 */
  backgroundImage?: string;
  /** 背景重复 */
  backgroundRepeat?: string;
  /** 设置背景图像的起始位置 */
  backgroundPosition?: string;
  /** 设置背景图片大小 */
  backgroundSize?: string;
  /** 节点使用横线样式 */
  nodeUseLineStyle?: boolean;
  /** 默认鸿蒙字体 */
  fontFamily?: string;
}

/** 节点类型 */
export type INodeType = "root" | "second" | "node" | "generalization";

// 主题配置类型
// export interface ITheme extends IDefaultTheme {
//   /** 根节点样式 */
//   root: INodeTheme;
//   /** 二级节点样式 */
//   second: INodeTheme;
//   /** 三级及以下节点样式 */
//   node: INodeTheme;
//   /** 概要节点样式 */
//   generalization: INodeTheme;
// }

export type ITheme = Record<INodeType, INodeTheme> & IDefaultTheme;
