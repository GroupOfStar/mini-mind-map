import { G, Rect, Text } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import type { Style } from "../../style";

/** 展开节点 */
export class ExpandNode {
  /** group */
  protected nodeGroup = new G({ class: "expand-group" });
  /** 节点框 */
  protected boxNodeEl = new Rect();
  /** 节点数文本 */
  protected textNodeEl = new Text();
  /** 样式主题 */
  private nodeStyle: Style;

  constructor(total: number, group: SVGType.G, nodeStyle: Style) {
    this.nodeStyle = nodeStyle;

    this.textNodeEl.addClass("expand-text");
    this.textNodeEl.text(total.toString());
    this.boxNodeEl.addClass("expand-box");
    this.nodeGroup.add(this.boxNodeEl);
    this.nodeGroup.add(this.textNodeEl);
    // 添加到节点组中
    this.nodeGroup.addTo(group);
  }
  /** 节点所占宽度 */
  public get nodeWidth(): number {
    const { expandOffset = 0 } = this.nodeStyle.theme.config;
    const { width = 0 } = this.nodeGroup?.bbox() || {};
    return width ? expandOffset + width : 0;
  }
  /** 节点所占高度 */
  public get nodeHeight(): number {
    const { expandOffset = 0 } = this.nodeStyle.theme.config;
    const { height = 0 } = this.nodeGroup?.bbox() || {};
    return height > 0 ? expandOffset + height : 0;
  }
  /** 设置节点样式 */
  public setNodeStyle() {
    if (this.textNodeEl) {
      const {
        backgroundColor = "#fff",
        expandborderWidth = 2,
        expandTBPadding = 0,
        expandLRPading = 0,
        expandFontSize = 14,
        expandRadius = 0,
      } = this.nodeStyle.theme.config;
      this.textNodeEl.font({ size: expandFontSize, family: "Arial" });
      this.textNodeEl.css({ cursor: "pointer", fill: "#257BF1" });
      if (this.boxNodeEl) {
        this.boxNodeEl.css({ cursor: "pointer", fill: backgroundColor });
        this.boxNodeEl.stroke({ color: "#257BF1", width: expandborderWidth });
        this.boxNodeEl.radius(expandRadius);
        const { width = 0, height = 0 } = this.textNodeEl.bbox() || {};
        this.boxNodeEl.size(
          width + (expandborderWidth + expandLRPading) * 2,
          height + (expandborderWidth + expandTBPadding) * 2
        );
      }
    }
  }
  /** 设置布局 */
  public doNodeLayout(offset: number = 0) {
    this.textNodeEl?.cx(0).cy(0);
    this.boxNodeEl?.cx(0).cy(0);
    const { expandOffset = 0 } = this.nodeStyle.theme.config;
    const { width } = this.nodeGroup.bbox();
    // 设置展开节点位置
    this.nodeGroup.relative(offset + width / 2 + expandOffset, 0);
  }
}