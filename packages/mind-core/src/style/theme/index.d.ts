import type { TNodeTypeOfKey } from "./../../node/index.d";

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

/** 布局类型 */
export type ILayoutType =
  | "Standard"
  | "DownwardOrganizational"
  | "UpwardOrganizational"
  | "LeftLogical"
  | "RightLogical";

/** 画布配置 */
export interface IConfig {
  /** 布局类型 */
  layout: ILayoutType;
  /** 图片显示的最大宽度 */
  imgMaxWidth?: number;
  /** 图片显示的最大高度 */
  imgMaxHeight?: number;
  /** 一行文本的最大宽度 */
  lineTextMaxWidth?: number;
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
  /** 选中节点后边框内的边距 */
  selectedBorderPadding?: number;
  /** 展开图标的边框宽度 */
  expandborderWidth?: number;
  /** 展开图标上下内边距, 注：内边距是不包含边框的 */
  expandTBPadding?: number;
  /** 展开图标左右内边距, 注：内边距是不包含边框的 */
  expandLRPading?: number;
  /** 展开图标字体大小 */
  expandFontSize?: number;
  /** 展开图标圆角大小 */
  expandRadius?: number;
  /** 展开图标的偏移 */
  expandOffset?: number;
}

/** 主题配置 */
export type ITheme = Record<TNodeTypeOfKey, INodeTheme> & IConfig;
