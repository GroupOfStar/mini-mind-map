import type { AddIconNode } from "./../node";
import type { ITypeOfNodeType } from "./../node/index.d";

/** 激活的节点 */
export class ActivatedNode {
  private _nodes: Set<ITypeOfNodeType> = new Set();
  private addIconNode: AddIconNode;
  constructor(addIconNode: AddIconNode) {
    this.addIconNode = addIconNode;
  }
  public get nodes() {
    return this._nodes;
  }
  public set nodes(val: Set<ITypeOfNodeType>) {
    this._nodes = val;
  }
  /** 获取第一个节点 */
  public get firstNode(): ITypeOfNodeType | undefined {
    return this._nodes.values().next().value;
  }
  public has(node: ITypeOfNodeType) {
    return this._nodes.has(node);
  }
  public add(node: ITypeOfNodeType) {
    if (!this.has(node)) {
      node.shape.setActivation();
      this._nodes.add(node);
    }
    return this;
  }
  public delete(node: ITypeOfNodeType) {
    if (this.has(node)) {
      node.shape.setDeActivation();
      this._nodes.delete(node);
    }
    return this;
  }
  public clear() {
    this._nodes.forEach((item) => {
      this.delete(item);
    });
  }
  /**保留一个 */
  public keepOne(node: ITypeOfNodeType): void {
    if (this.has(node)) {
      this._nodes.forEach((item) => {
        if (item !== node) {
          this.delete(item);
        }
      });
    } else {
      this.clear();
      this.add(node);
    }
    if (node.children.length > 0) {
      this.addIconNode.onHide();
    } else {
      // 显示新增按钮 并注册相关快捷键
      this.addIconNode.onShowByNode(node);
    }
  }
}
