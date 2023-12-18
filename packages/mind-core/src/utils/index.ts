import { Node } from "./../node";
import type { IForEachNode } from "./index.d";

interface IFontString {
  fontSize: number;
  fontFamily?: string;
  italic?: string;
  bold?: string;
}

/**
 * 工具类
 */
export class Utils {
  private static measureTextContext: CanvasRenderingContext2D | null = null;

  // 拼接font字符串
  private static joinFontStr(fontStr: IFontString) {
    const italic = fontStr.italic ? "italic" : "";
    const bold = fontStr.bold ? "bold" : "";
    return `${italic} ${bold} ${fontStr.fontSize}px ${fontStr.fontFamily} `;
  }

  // 计算节点的文本长宽
  static measureText(
    text: string,
    fontStr: IFontString = {
      fontSize: 16,
      fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
    }
  ) {
    const font = this.joinFontStr(fontStr);
    if (!this.measureTextContext) {
      const canvas = document.createElement("canvas");
      this.measureTextContext = canvas.getContext("2d");
    }

    const textSize = { width: 0, height: 0 };
    if (this.measureTextContext) {
      this.measureTextContext.save();
      this.measureTextContext.font = font;
      const textMetrics = this.measureTextContext.measureText(text);
      textSize.width = textMetrics.width;
      textSize.height = textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent;
      this.measureTextContext.restore();
    }
    return textSize;
  }

  // 防抖
  static debounce(fn: Function, time: number = 300) {
    let timer: NodeJS.Timeout | null = null;
    return function (this: object, ...args: any[]) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, time);
    };
  }
}

/**
 * 对数组循环callback
 * @param callback 遍历时执行的回调
 */
export function nodeListForEach(list: Node[], callback: IForEachNode) {
  let parentNode: Node | undefined = undefined;
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (parentNode && item.nodeData.pid === (parentNode as Node).nodeData.id) {
      callback(item, i, parentNode);
    } else {
      parentNode = list.find((ele) => ele.nodeData.id === item.nodeData.pid);
      callback(item, i, parentNode);
    }
  }
}

/**
 * 优先深度顺序获取节点及子节点
 */
export function getDepthNodeList(node: Node) {
  const nodeList: Node[] = [];
  const stack: Node[] = [node];
  while (stack.length) {
    const item = stack.pop() as Node;
    nodeList.push(item);
    for (let i = item.children.length - 1; i > -1; i--) {
      stack.push(item.children[i]);
    }
  }
  return nodeList;
}

/**
 * 优先广度顺序获取节点及子节点
 */
export function getScopeNodeList(node: Node) {
  const nodeList: Node[] = [];
  const queue: Node[] = [node];
  while (queue.length) {
    const item = queue.shift() as Node;
    nodeList.push(item);
    for (let i = 0; i < item.children.length; i++) {
      queue.push(item.children[i]);
    }
  }
  return nodeList;
}

/**
 * 优先深度遍历节点及子节点
 * @param callback 遍历时执行的回调
 */
export function forDepthEachTree(
  callback: IForEachNode,
  node: Node,
  index: number,
  parentNode?: Node
) {
  callback(node, index, parentNode);
  if (node.children) {
    node.children.forEach((item, idx) => {
      forDepthEachTree(callback, item, idx, node);
    });
  }
}

/**
 * 优先广度遍历节点及子节点树
 * @param callback 遍历时执行的回调
 */
export function forScopeEachTree(callback: IForEachNode, nodeTree: Node[], parentNode?: Node) {
  const nodeList: Node[] = [];
  nodeTree.forEach((item, index) => {
    callback(item, index, parentNode);
    if (item.children) {
      nodeList.push(item);
    }
  });
  nodeList.forEach((item) => {
    forScopeEachTree(callback, item.children, item);
  });
}
