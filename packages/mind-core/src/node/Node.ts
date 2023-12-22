import { G, Rect, Text } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import type { IEvents, INodeData } from "./../graph/index.d";
import { Style } from "./../style";
import { RectShape } from "./../shape";
import type { INodeProps } from "./index.d";
import { Emitter } from "./../emitter/index.d";

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
  /** 事件广播 */
  emitter?: Emitter<IEvents>;

  constructor(props: INodeProps) {
    const { nodeData, nodeType, nodesGroup, parentNode, emitter } = props;
    const id = nodeData.id.trim();
    this.id = id;
    this.group = new G().attr({ id: id.replace(/#|-/g, "") });
    if (nodesGroup) {
      this.nodesGroup = nodesGroup;
      this.group.addTo(nodesGroup);
    } else {
      this.nodesGroup = new G();
    }
    this.nodeData = nodeData;
    this.parentNode = parentNode;
    this.style = new Style(nodeType);
    this.shape = new RectShape(nodeData, this.style);
    this.emitter = emitter;
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
      const { marginX, marginY } = node.style;
      bb.left = Math.min(bb.left, x);
      bb.top = Math.min(bb.top, y);
      bb.width = Math.max(bb.width, x + width + marginX);
      bb.height = Math.max(bb.height, y + height + marginY);
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
      const { marginX } = node.style;
      node.shape.x = x - (x - bb.left) * 2 - (width + marginX);
    });
    this.translate(bb.width, 0);
  }
  /** 节点纵坐标由下变成上 */
  down2up() {
    const bb = this.getBoundingBox();
    this.eachNode((node) => {
      const { y, height } = node.shape;
      const { marginY } = node.style;
      node.shape.y = y - (y - bb.top) * 2 - (height + marginY);
    });
    this.translate(0, bb.height);
  }
  /** 设置节点样式 */
  abstract setNodeStyle(): void;
  /** 设置位置 */
  transform(matrixAlias: {
    rotate: number;
    translateX: number;
    translateY: number;
    scale: number;
  }) {
    this.group.transform(matrixAlias);
  }
  /** 节点鼠标移入事件 */
  onMouseover(event: Event) {
    event.stopPropagation();
    if (!this.borderNode.hasClass("active")) {
      this.borderNode.stroke({ width: 1, color: "#caa2ff" });
    }
  }
  /** 节点鼠标移出事件 */
  onMouseout(event: Event) {
    event.stopPropagation();
    if (!this.borderNode.hasClass("active")) {
      this.borderNode.stroke({ width: 1, color: "transparent" });
    }
  }
  /** 节点点击事件 */
  onClick(event: Event) {
    event.stopPropagation();
    // 先取消容器组下所有的active样式
    this.nodesGroup.find("rect.active").forEach((item) => {
      item.stroke({ width: 1, color: "transparent" });
      item.removeClass("active");
    });
    // 再给当前的节点加上active样式
    this.borderNode.addClass("active");
    this.borderNode.stroke({ width: 1, color: "#7716d9" });
  }
  /** 注册事件 */
  bindEvent() {
    this.onMouseover = this.onMouseover.bind(this);
    this.onMouseout = this.onMouseout.bind(this);
    this.onClick = this.onClick.bind(this);

    this.group.on("mouseover", this.onMouseover);
    this.group.on("mouseout", this.onMouseout);
    this.group.on("click", this.onClick);
  }
  /** 解除事件 */
  unbindEvent() {
    this.group.off();
  }
}
