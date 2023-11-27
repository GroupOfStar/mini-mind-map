import { G, Rect, Text } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import { Node } from "./Node";
import { INodeData } from "src/graph";
import { RectShape } from "src/shape";

export class SecondNode extends Node {
  shape: RectShape;
  _textNode = new Text();
  _thisNode = new Rect();
  constructor(nodeData: INodeData, nodesGroup: SVGType.G) {
    super(nodeData, nodesGroup, "second");
    this.shape = new RectShape(nodeData);
    // 文本节点
    this._textNode.addClass("text").text(nodeData.text || "");
    // 节点边框
    this._borderNode.addTo(this.group).addClass("node-border");
    // 节点本身
    this._thisNode.addTo(this.group).addClass("node");

    // 确保text节点在最后一个, 所以最后添加
    this._textNode.addTo(this.group);
    this.style.setStyle(nodeData.theme);
    this.style.setNodeStyleByType(this.group);

    // 一定要最后设置cx和cy,否则会错乱
    this._textNode.cx(0).cy(0);
  }

  createNode() {}

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
