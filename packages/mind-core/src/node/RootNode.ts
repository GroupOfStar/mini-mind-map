import { G, Rect, Text } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import { Node } from "./Node";
import { INodeData } from "src/graph";
import { RectShape } from "src/shape";

export class RootNode extends Node {
  shape: RectShape;
  _textNode = new Text();
  _thisNode = new Rect();
  constructor(nodeData: INodeData, nodesGroup: SVGType.G) {
    super(nodeData, nodesGroup, "root");
    this.shape = new RectShape(nodeData, this.style);
    // 文本节点
    this._textNode.addClass("text").text(nodeData.text || "");
    // 节点边框
    this._borderNode.addTo(this.group).addClass("node-border");
    // 节点本身
    this._thisNode.addTo(this.group).addClass("node");

    // 确保text节点在最后一个, 所以最后添加
    this._textNode.addTo(this.group);
    // this.style.setStyle(nodeData.theme);
    // this.style.setNodeStyleByType(this.group);

    // 一定要最后设置cx和cy,否则会错乱
    this._textNode.cx(0).cy(0);
  }

  setNodeStyle() {
    const { color, borderRadius = 0, fillColor, borderColor } = this.style;
    // 文本节点
    this._textNode.fill({ color }).css({ cursor: "pointer" });

    // 中间节点
    this._thisNode.size(this.shape.cWidth, this.shape.cHeight);
    this._thisNode.css("cursor", "pointer").radius(borderRadius);
    this._thisNode.fill({ color: fillColor }).cx(0).cy(0);

    // 整个节点
    this._borderNode.size(this.shape.width, this.shape.height);
    this._borderNode.stroke({ color: borderColor });
    // 默认填充的是黑色,所以要设置成完全透明
    this._borderNode.css("cursor", "pointer").fill({ opacity: 0 });
    this._borderNode.radius(borderRadius).cx(0).cy(0);
  }

  // 设置位置
  transform(matrixAlias: {
    rotate: number;
    translateX: number;
    translateY: number;
    scale: number;
  }) {
    this.group.transform(matrixAlias);
  }
}
