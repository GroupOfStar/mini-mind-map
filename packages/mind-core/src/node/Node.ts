import { G, Rect, Text } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import { INodeData } from "./../graph";
import { Style } from "./../style";
import { RectShape } from "src/shape";
import type { INodeType } from "./../style";

export abstract class Node {
  nodesGroup: G;
  group: G;
  nodeData: INodeData;
  deep: number = 0;
  style: Style;
  shape: RectShape;
  _borderNode = new Rect();
  children: Node[] = [];
  childAreaHeight = 0;
  constructor(nodeData: INodeData, nodesGroup: SVGType.G, nodeType: INodeType) {
    this.nodesGroup = nodesGroup;
    this.group = new G().addTo(nodesGroup);
    this.nodeData = nodeData;
    this.style = new Style(nodeType);
    this.shape = new RectShape(nodeData, this.style);
  }

  /** 设置节点样式 */
  abstract setNodeStyle(): void;

  /** 给所有节点注册事件 */
  addEventListener() {
    this.group.on("mouseover", (event) => {
      event.stopPropagation();
      if (!this._borderNode.hasClass("active")) {
        this._borderNode.stroke({ width: 1, color: "#caa2ff" });
      }
    });

    this.group.on("mouseout", (event) => {
      event.stopPropagation();
      if (!this._borderNode.hasClass("active")) {
        this._borderNode.stroke({ width: 1, color: "transparent" });
      }
    });

    this.group.on("click", (event) => {
      event.stopPropagation();
      // 先取消容器组下所有的active样式
      this.nodesGroup.find("rect.active").forEach((item) => {
        item.stroke({ width: 1, color: "transparent" });
        item.removeClass("active");
      });
      // 再给当前的节点加上active样式
      this._borderNode.addClass("active");
      this._borderNode.stroke({ width: 1, color: "#7716d9" });
    });
  }
}
