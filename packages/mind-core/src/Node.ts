import { G, Rect, Text } from "@svgdotjs/svg.js";

export default class Node {
  group: G;
  width: number | undefined;
  height: number | undefined;
  nodeData: any;
  draw: any;

  constructor(opt = {}) {
    this.group = new G(); // 节点容器
    this.getSize();
    this.render();
  }
  // 计算节点宽高
  getSize() {
    let textData = this.createTextNode();
    this.width = textData.width + 20; // 左右内边距各10
    this.height = textData.height + 10; // 上下内边距各5
  }
  // 创建文本节点
  createTextNode() {
    let node = new Text().text(this.nodeData.data.text);
    let { width, height } = node.bbox(); // 获取文本节点的宽高
    return {
      node,
      width,
      height
    };
  }
  // 渲染节点
  render() {
    let textData = this.createTextNode();
    textData.node.x(10).y(5); // 文字节点相对于容器偏移内边距的大小
    // 创建一个矩形来作为边框
    this.group.rect(this.width, this.height).x(0).y(0);
    // 文本节点添加到节点容器里
    this.group.add(textData.node);
    // 在画布上定位该节点
    if (this.left) {
      this.group.translate(this.left(), this.top());
    }
    // 容器添加到画布上
    this.draw.add(this.group);
  }
  left(left?: any, top?: any) {
    return 10;
  }
  top(left?: any, top?: any) {
    return 12;
  }
}
