import { G, Rect, Text } from "@svgdotjs/svg.js";
import { Theme } from "./theme";
import type { INodeTheme } from "./theme";
import type { TNodeTypeOfKey } from "./../node/index.d";
import type { INodeData } from "./../graph/index.d";

// // 获取类型中的函数名称
// type MethodNames<T> = {
//   [K in keyof T]: T[K] extends Function ? K : never;
// }[keyof T];

// /** 节点类型 */
// export type TNodeTypeOfKey = Exclude<
//   keyof Theme,
//   "defalutTheme" | MethodNames<Theme>
// >;

export class Style implements INodeTheme {
  /** 节点类型 */
  nodeType: TNodeTypeOfKey;

  /** 节点横向边距 */
  paddingX?: number;
  /** 节点纵向边距 */
  paddingY?: number;
  /** 节点横向间距  */
  marginX: number = 0;
  /** 节点纵向间距 */
  marginY: number = 0;
  /** 节点填充颜色 */
  fillColor?: string;
  /** 节点字体粗细 */
  fontWeight?: number | string;
  /** 节点字体大小 */
  fontSize?: number;
  /** 节点字体颜色 */
  color?: string;
  /** 节点字体样式 */
  /** 边框颜色 */
  borderColor?: string;
  /** 边框宽度 */
  borderWidth?: number;
  /** 边框样式 */
  borderDasharray?: string;
  /** 边框圆角 */
  borderRadius?: number;
  /** 选中状态样式 */
  active?: {
    /** 选中状态的边框样式 */
    borderDasharray?: string;
    /** 选中状态的边框颜色 */
    rectBorder?: string;
  };
  theme: Theme;

  constructor(nodeType: TNodeTypeOfKey) {
    this.nodeType = nodeType;
    const theme = new Theme();
    const nodeThemeStyle = theme[this.nodeType];
    if (nodeThemeStyle) {
      // 深度赋值
      Object.assign(this, nodeThemeStyle);
    }
    this.theme = theme;
    this.setStyle({});
  }

  /**
   *
   * @param {INodeData["theme"]} nodeTheme 节点自身样式
   * @param {TNodeTypeOfKey} nodeType 节点类型
   */
  setStyle(nodeTheme: INodeData["theme"] = {}) {
    // const nodeThemeStyle = this.theme[this.nodeType];
    // if (nodeThemeStyle) {
    //   // 深度赋值
    //   Object.assign(this, nodeThemeStyle);
    // }
  }

  /**
   * 通过节点类型设置节点样式
   * @param node 节点组
   * @param theme 节点类型
   */
  setNodeStyleByType(node: G) {
    const textNode = node.findOne(".text") as Text;
    const thisNode = node.findOne(".node") as Rect;
    const borderNode = node.findOne(".selected-node") as Rect;
    const { color, paddingX = 0, paddingY = 0, borderColor, borderRadius = 0, fillColor } = this;

    let width = 0;
    let height = 0;
    if (textNode) {
      textNode.fill({ color }).css({ cursor: "pointer" });
      const bbox = textNode.bbox();
      width = bbox.width;
      height = bbox.height;
    }
    if (thisNode) {
      thisNode.size(width + paddingX * 2, height + paddingY * 2);
      thisNode.css("cursor", "pointer").radius(borderRadius);
      thisNode.fill({ color: fillColor }).cx(0).cy(0);
    }
    if (borderNode) {
      borderNode.size(width + paddingX * 2 + 8, height + paddingY * 2 + 8);
      borderNode.stroke({ color: borderColor });
      // 默认填充的是黑色,所以要设置成完全透明
      borderNode.css("cursor", "pointer").fill({ opacity: 0 });
      borderNode.radius(borderRadius).cx(0).cy(0);
    }
    // node.fill(fill).stroke(stroke).strokeWidth(strokeWidth);
  }
}
