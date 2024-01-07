import { Rect, Text } from "@svgdotjs/svg.js";
import { Node } from "./Node";
import type { IGeneralizationNodeProps } from "./index.d";
import { DefaultNode } from "./DefaultNode";

export class GeneralizationNode extends Node<DefaultNode, unknown> {
  private textNodeEl = new Text();
  private thisNodeEl = new Rect();
  constructor(props: IGeneralizationNodeProps<DefaultNode, unknown>) {
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
  }

  setNodeStyle() {
    const { color, borderRadius = 0, fillColor, borderColor } = this.style;
    // 文本节点
    this.textNodeEl.fill({ color }).css({ cursor: "pointer" });

    const { visibleWidth, visibleHeight } = this.shape;
    // 中间节点
    this.thisNodeEl.size(visibleWidth, visibleHeight);
    this.thisNodeEl.css("cursor", "pointer").radius(borderRadius);
    this.thisNodeEl.fill({ color: fillColor }).cx(0).cy(0);

    // 整个节点
    this.borderNodeEl.size(this.shape.width, this.shape.height);
    this.borderNodeEl.stroke({ color: borderColor });
    // 默认填充的是黑色,所以要设置成完全透明
    this.borderNodeEl.css("cursor", "pointer").fill({ opacity: 0 });
    this.borderNodeEl.radius(borderRadius).cx(0).cy(0);
  }
}
