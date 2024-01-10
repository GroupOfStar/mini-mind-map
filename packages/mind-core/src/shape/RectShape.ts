import type * as SVGType from "@svgdotjs/svg.js";
import { Shape } from "./Shape";
import { Style } from "./../style";
import type { INodeData } from "./../graph/index.d";

export class RectShape extends Shape {
  private nodeStyle: Style;

  constructor(node: INodeData, nodeStyle: Style, group: SVGType.G) {
    super(node, group);
    this.nodeStyle = nodeStyle;
  }
  get visibleWidth(): number {
    const { width } = this.textNodeEl.bbox();
    return width + (this.nodeStyle.paddingX || 0) * 2;
  }
  get visibleHeight(): number {
    const { height } = this.textNodeEl.bbox();
    return height + (this.nodeStyle.paddingY || 0) * 2;
  }
  get selectedBoxPadding(): number {
    const { borderWidth = 0, theme } = this.nodeStyle;
    const { selectedBorderPadding = 0 } = theme.config;
    return selectedBorderPadding + borderWidth;
  }
  get selectedWidth(): number {
    return this.visibleWidth + this.selectedBoxPadding * 2;
  }
  get selectedHeight(): number {
    return this.visibleHeight + this.selectedBoxPadding * 2;
  }
  get expandNodeWidth(): number {
    const { expandOffset = 0 } = this.nodeStyle.theme.config;
    const { width = 0 } = this.expandNodeGroup?.bbox() || {};
    return width ? expandOffset + width : 0;
  }
  get expandNodeHeight(): number {
    const { expandOffset = 0 } = this.nodeStyle.theme.config;
    const { height = 0 } = this.expandNodeGroup?.bbox() || {};
    return height > 0 ? expandOffset + height : 0;
  }
  get width(): number {
    return this.selectedWidth + this.expandNodeWidth;
  }
  get height(): number {
    return this.selectedHeight + this.expandNodeHeight;
  }
  /** 设置样式 */
  setNodeStyle() {
    const { color, borderRadius = 0, fillColor, borderColor } = this.nodeStyle;
    // 文本节点
    this.textNodeEl.fill({ color }).css({ cursor: "pointer" });

    // 中间节点
    this.thisNodeEl.size(this.visibleWidth, this.visibleHeight);
    this.thisNodeEl.css("cursor", "pointer").radius(borderRadius);
    this.thisNodeEl.fill({ color: fillColor });

    // 整个节点
    this.borderNodeEl.size(this.selectedWidth, this.selectedHeight);
    this.borderNodeEl.stroke({ color: borderColor });
    // 默认填充的是黑色,所以要设置成完全透明
    this.borderNodeEl.css("cursor", "pointer").fill({ opacity: 0 });
    this.borderNodeEl.radius(borderRadius);
  }
  /** 节点布局 */
  doNodeLayout() {
    this.thisNodeEl.cx(0).cy(0);
    this.borderNodeEl.cx(0).cy(0);
    // 一定要最后设置cx和cy,否则会错乱
    this.textNodeEl.cx(0).cy(0);
  }
  /** 设置展开收缩节点样式 */
  setExpandNodeStyle() {
    if (this.expandTextNodeEl) {
      const {
        backgroundColor = "#fff",
        expandborderWidth = 2,
        expandTBPadding = 0,
        expandLRPading = 0,
        expandFontSize = 14,
        expandRadius = 0,
      } = this.nodeStyle.theme.config;
      this.expandTextNodeEl.font({ size: expandFontSize, family: "Arial" });
      this.expandTextNodeEl.css({ cursor: "pointer", fill: "#257BF1" });
      if (this.expandBoxNodeEl) {
        this.expandBoxNodeEl.css({ cursor: "pointer", fill: backgroundColor });
        this.expandBoxNodeEl.stroke({ color: "#257BF1", width: expandborderWidth });
        this.expandBoxNodeEl.radius(expandRadius);
        const { width = 0, height = 0 } = this.expandTextNodeEl.bbox() || {};
        this.expandBoxNodeEl.size(
          width + (expandborderWidth + expandLRPading) * 2,
          height + (expandborderWidth + expandTBPadding) * 2
        );
      }
    }
  }
  /** 展开收缩布局 */
  doExpandNodeLayout() {
    this.expandTextNodeEl?.cx(0).cy(0);
    this.expandBoxNodeEl?.cx(0).cy(0);
    const { expandOffset = 0 } = this.nodeStyle.theme.config;
    // 设置展开节点位置
    const { width } = this.expandNodeGroup.bbox();
    this.expandNodeGroup.relative(this.selectedWidth / 2 + width / 2 + expandOffset, 0);
  }
  /** init */
  init() {
    this.setNodeStyle();
    this.doNodeLayout();
    // 设置展开收缩节点
    if (this.childTotal > 0) {
      // 创建展开收缩节点
      super.createExpandNode();
      this.setExpandNodeStyle();
      this.doExpandNodeLayout();
    }
  }
}
