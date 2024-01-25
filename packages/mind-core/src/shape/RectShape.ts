import { Shape } from "./Shape";
import type { Style } from "./../style";
import type { Node, SecondNode, DefaultNode } from "./../node";
import type { ITypeOfNodeType } from "./../node/index.d";
import type { INodeData } from "./../graph/index.d";
import { getWrapString } from "src/utils";

export class RectShape<
  P extends ITypeOfNodeType | never,
  C extends ITypeOfNodeType,
  D extends SecondNode | DefaultNode
> extends Shape<P, C, D> {
  private style: Style;

  constructor(node: Node<P, C, D>) {
    super(node);
    this.style = node.style;
  }
  get visibleNodeWidth(): number {
    const { width } = this.textNodeEl.bbox();
    return width + (this.style.paddingX || 0) * 2;
  }
  get visibleNodeHeight(): number {
    const { height } = this.textNodeEl.bbox();
    return height + (this.style.paddingY || 0) * 2;
  }
  get selectedBoxPadding(): number {
    const { borderWidth = 0, theme } = this.style;
    const { selectedBorderPadding = 0 } = theme.config;
    return selectedBorderPadding + borderWidth;
  }
  get selectedNodeWidth(): number {
    return this.visibleNodeWidth + this.selectedBoxPadding * 2;
  }
  get selectedNodeHeight(): number {
    return this.visibleNodeHeight + this.selectedBoxPadding * 2;
  }
  /** 设置样式 */
  public setNodeStyle(nodeData: INodeData) {
    const {
      fontSize,
      fontWeight,
      color,
      borderRadius = 0,
      fillColor,
      borderColor,
      theme,
    } = this.style;
    const { fontFamily, lineTextMaxWidth = 200 } = theme.config;
    // 文本节点
    const fontOption = { size: fontSize, family: fontFamily, bold: fontWeight };
    this.textNodeEl.font({
      family: fontFamily,
      size: fontSize,
      anchor: "left",
      // leading: 1,
      // stretch:,
      // style:
      // variant:
      weight: fontWeight,
    });
    const { text = "" } = nodeData;
    this.textNodeEl.text((tp) => {
      const wrapStr = getWrapString(text, lineTextMaxWidth, fontOption);
      wrapStr.forEach((str, index, arr) => {
        if (!str && index === arr.length - 1) {
          tp.tspan(".").attr({ visibility: "hidden" }).newLine();
        } else {
          tp.tspan(str).newLine();
        }
      });
    });
    this.textNodeEl.fill({ color }).attr({ "pointer-events": "none" });
    // @ts-ignore
    this.textNodeEl.css({ "user-select": "none" });

    // 中间节点
    this.visibleNodeEl.attr("pointer-events", "none");
    this.visibleNodeEl.size(this.visibleNodeWidth, this.visibleNodeHeight);
    this.visibleNodeEl.radius(borderRadius);
    this.visibleNodeEl.fill({ color: fillColor });

    // 整个节点
    this.selectedNodeEl.size(this.selectedNodeWidth, this.selectedNodeHeight);
    this.selectedNodeEl.stroke({ width: 1, color: borderColor });
    // 默认填充的是黑色,所以要设置成完全透明
    this.selectedNodeEl.fill({ opacity: 0 });
    this.selectedNodeEl.radius(borderRadius);
  }
  /** 节点布局 */
  public doNodeLayout() {
    this.visibleNodeEl.cx(0).cy(0);
    this.selectedNodeEl.cx(0).cy(0);
    // 一定要最后设置cx和cy,否则会错乱
    this.textNodeEl.cx(0).cy(0);
  }
}
