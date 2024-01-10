import type * as SVGType from "@svgdotjs/svg.js";
import { Shape } from "./Shape";
import { Style } from "./../style";
import type { INodeData } from "./../graph/index.d";
import type { ExpandNode } from "./../node/ExpandNode";

interface IRectShapeProps {
  nodeData: INodeData;
  nodeStyle: Style;
  group: SVGType.G;
  expandNode?: ExpandNode;
}

export class RectShape extends Shape {
  private nodeStyle: Style;
  private expandNode?: ExpandNode;

  constructor(props: IRectShapeProps) {
    super(props.nodeData, props.group);
    this.nodeStyle = props.nodeStyle;
  }
  get visibleNodeWidth(): number {
    const { width } = this.textNodeEl.bbox();
    return width + (this.nodeStyle.paddingX || 0) * 2;
  }
  get visibleNodeHeight(): number {
    const { height } = this.textNodeEl.bbox();
    return height + (this.nodeStyle.paddingY || 0) * 2;
  }
  get selectedBoxPadding(): number {
    const { borderWidth = 0, theme } = this.nodeStyle;
    const { selectedBorderPadding = 0 } = theme.config;
    return selectedBorderPadding + borderWidth;
  }
  get selectedNodeWidth(): number {
    return this.visibleNodeWidth + this.selectedBoxPadding * 2;
  }
  get selectedNodeHeight(): number {
    return this.visibleNodeHeight + this.selectedBoxPadding * 2;
  }
  get width(): number {
    return this.selectedNodeWidth + (this.expandNode?.nodeWidth || 0);
  }
  get height(): number {
    return this.selectedNodeHeight + (this.expandNode?.nodeHeight || 0);
  }
  /** 设置样式 */
  setNodeStyle() {
    const { color, borderRadius = 0, fillColor, borderColor } = this.nodeStyle;
    // 文本节点
    this.textNodeEl.fill({ color }).css({ cursor: "pointer" });

    // 中间节点
    this.visibleNodeEl.size(this.visibleNodeWidth, this.visibleNodeHeight);
    this.visibleNodeEl.css("cursor", "pointer").radius(borderRadius);
    this.visibleNodeEl.fill({ color: fillColor });

    // 整个节点
    this.selectedNodeEl.size(this.selectedNodeWidth, this.selectedNodeHeight);
    this.selectedNodeEl.stroke({ color: borderColor });
    // 默认填充的是黑色,所以要设置成完全透明
    this.selectedNodeEl.css("cursor", "pointer").fill({ opacity: 0 });
    this.selectedNodeEl.radius(borderRadius);
  }
  /** 节点布局 */
  doNodeLayout() {
    this.visibleNodeEl.cx(0).cy(0);
    this.selectedNodeEl.cx(0).cy(0);
    // 一定要最后设置cx和cy,否则会错乱
    this.textNodeEl.cx(0).cy(0);
  }
}
