import { G, Rect, Text } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import { INodeData } from "./../graph";
import { Style } from "./../style";
import { RectShape } from "src/shape";
import type { INodeType } from "./../style";

export abstract class Node {
  /** 节点group挂载的group容器 */
  nodesGroup: G;
  /** 节点group */
  group: G;
  /** id */
  id: string;
  /** 节点data */
  nodeData: INodeData;
  /** 深度 */
  depth: number = 0;
  /** 样式主题 */
  style: Style;
  /** 形状 */
  shape: RectShape;
  /** 父节点 */
  parentNode?: Node;
  /** 子节点 */
  children: Node[] = [];
  /** 边框节点 */
  protected borderNode = new Rect();

  constructor(nodeData: INodeData, nodesGroup: SVGType.G, nodeType: INodeType, parentNode?: Node) {
    this.nodesGroup = nodesGroup;
    this.group = new G().addTo(nodesGroup);
    this.id = nodeData.id;
    this.nodeData = nodeData;
    this.parentNode = parentNode;
    this.style = new Style(nodeType);
    this.shape = new RectShape(nodeData, this.style);
  }
  /** 是否为根节点 */
  get isRoot() {
    return this.depth === 0;
  }
  /** 遍历节点及子节点 */
  eachNode(callback: (node: Node) => void) {
    let nodes: Node[] = [this];
    let current: Node | undefined = undefined;
    while ((current = nodes.shift())) {
      callback(current);
      nodes = nodes.concat(current.children);
    }
  }
  /** 获取节点树的边界框 */
  getBoundingBox() {
    const bb = {
      left: Number.MAX_VALUE,
      top: Number.MAX_VALUE,
      width: 0,
      height: 0,
    };
    this.eachNode((node) => {
      const { x, y, width, height } = node.shape;
      bb.left = Math.min(bb.left, x);
      bb.top = Math.min(bb.top, y);
      bb.width = Math.max(bb.width, x + width);
      bb.height = Math.max(bb.height, y + height);
    });
    return bb;
  }
  /** 节点树整体偏移 */
  translate(tx = 0, ty = 0) {
    this.eachNode((node) => {
      node.shape.x += tx;
      node.shape.y += ty;
    });
  }
  /** 节点横坐标由右变成左 */
  right2left() {
    const bb = this.getBoundingBox();
    this.eachNode((node) => {
      const { x, width } = node.shape;
      node.shape.x = x - (x - bb.left) * 2 - width;
    });
    this.translate(bb.width, 0);
  }
  /** 节点纵坐标由下变成上 */
  down2up() {
    const bb = this.getBoundingBox();
    this.eachNode((node) => {
      const { y, height } = node.shape;
      node.shape.y = y - (y - bb.top) * 2 - height;
    });
    this.translate(0, bb.height);
  }
  /** 设置节点样式 */
  abstract setNodeStyle(): void;
  // 设置位置
  transform(matrixAlias: {
    rotate: number;
    translateX: number;
    translateY: number;
    scale: number;
  }) {
    this.group.transform(matrixAlias);
  }
  /** 给所有节点注册事件 */
  addEventListener() {
    this.group.on("mouseover", (event) => {
      event.stopPropagation();
      if (!this.borderNode.hasClass("active")) {
        this.borderNode.stroke({ width: 1, color: "#caa2ff" });
      }
    });

    this.group.on("mouseout", (event) => {
      event.stopPropagation();
      if (!this.borderNode.hasClass("active")) {
        this.borderNode.stroke({ width: 1, color: "transparent" });
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
      this.borderNode.addClass("active");
      this.borderNode.stroke({ width: 1, color: "#7716d9" });
    });
  }
}
