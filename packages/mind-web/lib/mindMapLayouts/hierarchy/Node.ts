const PEM = 18;
const DEFAULT_HEIGHT = PEM * 2;
const DEFAULT_GAP = PEM;

const DEFAULT_OPTIONS: INodeOptions = {
  getId(item) {
    return item.id || item.name;
  },
  getHGap(item) {
    return item.hgap || DEFAULT_GAP;
  },
  getVGap(item) {
    return item.vgap || DEFAULT_GAP;
  },
  getChildren(item) {
    return item.children;
  },
  getHeight(item) {
    return item.height || DEFAULT_HEIGHT;
  },
  getWidth(item) {
    const name = item.name || " ";
    return item.width || name.split("").length * PEM;
  },
};

/** 节点数据 */
export interface INodeItem {
  id: string;
  name: string;
  [key: string]: any;
}

export interface INodeOptions {
  getId?: (item: INodeItem) => any;
  getHGap?: (item: INodeItem) => number;
  getVGap?: (item: INodeItem) => number;
  getChildren?: (item: INodeItem) => any;
  getHeight?: (item: INodeItem) => number;
  getWidth?: (item: INodeItem) => number;
}

export class Node {
  /** id */
  id: any;
  /** 垂直间距 */
  vgap: number;
  /** 水平间距 */
  hgap: number;
  /** 节点数据 */
  data: INodeItem;
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
  /** 横坐标 */
  x: number;
  /** 纵坐标 */
  y: number;
  /** 节点层级, 根节点为0 */
  depth: number;
  /** 父节点 */
  parent?: Node;
  /** 子节点 */
  children: Node[] = [];
  constructor(data: INodeItem, options: INodeOptions = {}, isolated?: boolean) {
    this.vgap = this.hgap = 0;
    this.data = data;

    this.width = this.fallbackExecuteOnData(options.getWidth, DEFAULT_OPTIONS.getWidth, data);
    this.height = this.fallbackExecuteOnData(options.getHeight, DEFAULT_OPTIONS.getHeight, data);
    this.id = this.fallbackExecuteOnData(options.getId, DEFAULT_OPTIONS.getId, data);
    this.x = this.y = 0;
    this.depth = 0;
    if (data instanceof Node) return data;

    if (!isolated && !data.isCollapsed) {
      const nodes: Node[] = [this];
      let node: Node | undefined;
      while ((node = nodes.pop())) {
        if (!node.data.isCollapsed) {
          const children = this.fallbackExecuteOnData(
            options.getChildren,
            DEFAULT_OPTIONS.getChildren,
            node.data
          );
          const length = children ? children.length : 0;
          node.children = [];
          if (children && length) {
            for (let i = 0; i < length; i++) {
              const child = new Node(children[i], options);
              node.children.push(child);
              nodes.push(child);
              child.parent = node;
              child.depth = node.depth + 1;
            }
          }
        }
      }
    }
    const hgap = this.fallbackExecuteOnData(options.getHGap, DEFAULT_OPTIONS.getHGap, data);
    const vgap = this.fallbackExecuteOnData(options.getVGap, DEFAULT_OPTIONS.getVGap, data);

    this.hgap += hgap;
    this.vgap += vgap;
    this.width += 2 * hgap;
    this.height += 2 * vgap;
  }
  private fallbackExecuteOnData(
    func1: INodeOptions[keyof INodeOptions],
    func2: INodeOptions[keyof INodeOptions],
    data: INodeItem
  ) {
    if (func1) return func1(data);
    return func2?.(data);
  }
  isRoot() {
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
      bb.left = Math.min(bb.left, node.x);
      bb.top = Math.min(bb.top, node.y);
      bb.width = Math.max(bb.width, node.x + node.width);
      bb.height = Math.max(bb.height, node.y + node.height);
    });
    return bb;
  }
  /** 节点树整体偏移 */
  translate(tx = 0, ty = 0) {
    this.eachNode((node) => {
      node.x += tx;
      node.y += ty;
    });
  }
  /** 节点横坐标由右变成左 */
  right2left() {
    const bb = this.getBoundingBox();
    this.eachNode((node) => {
      node.x = node.x - (node.x - bb.left) * 2 - node.width;
    });
    this.translate(bb.width, 0);
  }
  /** 节点纵坐标由下变成上 */
  down2up() {
    const bb = this.getBoundingBox();
    this.eachNode((node) => {
      node.y = node.y - (node.y - bb.top) * 2 - node.height;
    });
    this.translate(0, bb.height);
  }
}
