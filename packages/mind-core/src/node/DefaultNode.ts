import { Rect, Text } from "@svgdotjs/svg.js";
import { Node } from "./Node";
import type { IDefaultNodeProps } from "./index.d";
import type { SecondNode } from "./SecondNode";

export class DefaultNode extends Node<SecondNode | DefaultNode, DefaultNode> {
  private textNodeEl = new Text();
  private thisNodeEl = new Rect();
  constructor(props: IDefaultNodeProps<SecondNode | DefaultNode, DefaultNode>) {
    super({ ...props, nodeType: "node" });
    // 文本节点
    this.textNodeEl.addClass("text").text(props.nodeData.text || "");
    // 节点边框
    this.borderNodeEl.addTo(this.group).addClass("node-border");
    // 节点本身
    this.thisNodeEl.addTo(this.group).addClass("node");

    // 确保text节点在最后一个, 所以最后添加
    this.textNodeEl.addTo(this.group);
    // this.style.setStyle(nodeData.theme);
    // this.style.setNodeStyleByType(this.group);

    // 一定要最后设置cx和cy,否则会错乱
    this.textNodeEl.cx(0).cy(0);
    // 添加展开节点
    this.expandNodeGroup.addTo(this.group);
  }

  setNodeStyle() {
    const { color, borderRadius = 0, fillColor, borderColor, theme } = this.style;
    const { isHorizontal } = theme;
    // 文本节点
    this.textNodeEl.fill({ color }).css({ cursor: "pointer" });

    const { visibleWidth, visibleHeight, selectedWidth, selectedHeight, width, height } =
      this.shape;
    // 中间节点
    this.thisNodeEl.size(visibleWidth, visibleHeight);
    this.thisNodeEl.css("cursor", "pointer").radius(borderRadius);
    this.thisNodeEl.fill({ color: fillColor }).cx(0).cy(0);

    // 整个节点
    this.borderNodeEl.size(selectedWidth, selectedHeight);
    this.borderNodeEl.stroke({ color: borderColor });
    // 默认填充的是黑色,所以要设置成完全透明
    this.borderNodeEl.css("cursor", "pointer").fill({ opacity: 0 });
    this.borderNodeEl.radius(borderRadius).cx(0).cy(0);
    // 设置展开节点位置
    this.expandNodeGroup.relative(width / 2 + this.expandNodeGroup.bbox().width / 2, 0);
    // this.expandNodeGroup.position(width, 0);
  }
}
