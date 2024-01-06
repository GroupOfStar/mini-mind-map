import { Rect, Text } from "@svgdotjs/svg.js";
import { Node } from "./Node";
import type { IDefaultNodeProps } from "./index.d";
import type { SecondNode } from "./SecondNode";

export class DefaultNode extends Node<SecondNode | DefaultNode, DefaultNode> {
  private textNode = new Text();
  private thisNode = new Rect();
  constructor(props: IDefaultNodeProps<SecondNode | DefaultNode, DefaultNode>) {
    super({ ...props, nodeType: "node" });
    // 文本节点
    this.textNode.addClass("text").text(props.nodeData.text || "");
    // 节点边框
    this.borderNode.addTo(this.group).addClass("node-border");
    // 节点本身
    this.thisNode.addTo(this.group).addClass("node");

    // 确保text节点在最后一个, 所以最后添加
    this.textNode.addTo(this.group);
    // this.style.setStyle(nodeData.theme);
    // this.style.setNodeStyleByType(this.group);

    // 一定要最后设置cx和cy,否则会错乱
    this.textNode.cx(0).cy(0);
  }

  setNodeStyle() {
    const { color, borderRadius = 0, fillColor, borderColor } = this.style;
    // 文本节点
    this.textNode.fill({ color }).css({ cursor: "pointer" });

    // 中间节点
    this.thisNode.size(this.shape.cWidth, this.shape.cHeight);
    this.thisNode.css("cursor", "pointer").radius(borderRadius);
    this.thisNode.fill({ color: fillColor }).cx(0).cy(0);

    // 整个节点
    this.borderNode.size(this.shape.width, this.shape.height);
    this.borderNode.stroke({ color: borderColor });
    // 默认填充的是黑色,所以要设置成完全透明
    this.borderNode.css("cursor", "pointer").fill({ opacity: 0 });
    this.borderNode.radius(borderRadius).cx(0).cy(0);
  }
}
