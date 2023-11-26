import { G, Rect, Text } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import { Node } from "./Node";
import { INodeData } from "src/graph";
import { RectShape } from "src/shape";

export class RootNode extends Node {
  shape: RectShape;
  svgNode = {
    textNode: new Text(),
    borderNode: new Rect(),
    thisNode: new Rect()
  };
  constructor(nodeData: INodeData, nodesGroup: SVGType.G) {
    super(nodeData, nodesGroup, "root");
    this.shape = new RectShape(nodeData);
    const { textNode, borderNode, thisNode } = this.svgNode;
    // 文本节点
    textNode.addClass("text").text(nodeData.text || "");
    // 节点边框
    borderNode.addTo(this.group).addClass("node-border");
    // 节点本身
    thisNode.addTo(this.group).addClass("node");

    // 确保text节点在最后一个, 所以最后添加
    textNode.addTo(this.group);
    this.style.setStyle(nodeData.theme);
    this.style.setNodeStyleByType(this.group);

    // 一定要最后设置cx和cy,否则会错乱
    textNode.cx(0).cy(0);
  }

  createNode() {}

  /**
   * 给所有节点注册事件
   * @param nodesGroup 节点G组
   */
  addEventListener(nodesGroup: G) {
    const { borderNode } = this.svgNode;
    this.group.on("mouseover", event => {
      event.stopPropagation();
      if (!borderNode.hasClass("active")) {
        borderNode.stroke({ width: 1, color: "#caa2ff" });
      }
    });

    this.group.on("mouseout", event => {
      event.stopPropagation();
      if (!borderNode.hasClass("active")) {
        borderNode.stroke({ width: 1, color: "transparent" });
      }
    });

    this.group.on("click", event => {
      event.stopPropagation();
      // 先取消容器组下所有的active样式
      nodesGroup.find("rect.active").forEach(item => {
        item.stroke({ width: 1, color: "transparent" });
        item.removeClass("active");
      });
      // 再给当前的节点加上active样式
      borderNode.addClass("active");
      borderNode.stroke({ width: 1, color: "#7716d9" });
    });
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
