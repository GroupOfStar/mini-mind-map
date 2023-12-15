import { IDefaultTheme, ILayoutType, Theme } from "./theme";

export class Canvas implements IDefaultTheme {
  /** 布局类型 */
  layout: ILayoutType = "RightLogical";
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
  constructor() {
    const theme = new Theme();
    const defalutTheme = theme.defalutTheme;
    if (defalutTheme) {
      // 深度赋值
      Object.assign(this, defalutTheme);
    }
  }

  /** 是否为水平布局 */
  get isHorizontal() {
    return ["LeftLogical", "RightLogical", "Standard"].indexOf(this.layout) > -1;
  }
}
