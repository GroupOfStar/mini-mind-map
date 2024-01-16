import { Emitter } from "./../emitter";
import type { Node } from "./Node";
import type { IEvents } from "./../graph/index.d";

/** 节点事件 */
export class NodeEvent<P, C> extends Emitter<IEvents> {
  node: Node<P, C>;
  constructor(node: Node<P, C>) {
    super();
    this.node = node;
    this.bindEvent();
  }
  /** 节点鼠标移入事件 */
  private onMouseover(event: Event) {
    event.stopPropagation();
    this.node.shape.setMouseoverStyle();
  }
  /** 节点鼠标移出事件 */
  private onMouseout(event: Event) {
    event.stopPropagation();
    this.node.shape.setMouseoutStyle();
  }
  /** 节点点击事件 */
  private onClick(event: Event) {
    const { shape, style, nodeData } = this.node;
    const { x, y, selectedNodeWidth, selectedNodeHeight } = shape;
    const { marginX, marginY } = style;
    console.log(
      `${nodeData.text}:>>`,
      " x :",
      x,
      " y :",
      y,
      " selectedNodeWidth :",
      selectedNodeWidth,
      " selectedNodeHeight :",
      selectedNodeHeight,
      " marginX :",
      marginX,
      " marginY :",
      marginY
    );
    event.stopPropagation();
    // 将在Graph中先取消容器组下所有的active样式
    this.emit("node_click", this.node);
    shape.setActivation();
  }
  /** 节点右键事件 */
  private onContextmenu(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.emit("node_contextmenu", this.node);
  }
  /** 节点双击事件 */
  private onDblclick(event: Event) {
    event.preventDefault();
    this.emit("node_dblclick", this.node);
  }
  /** 注册事件 */
  public bindEvent() {
    this.onClick = this.onClick.bind(this);
    this.onDblclick = this.onDblclick.bind(this);
    this.onMouseover = this.onMouseover.bind(this);
    this.onMouseout = this.onMouseout.bind(this);
    this.onContextmenu = this.onContextmenu.bind(this);

    this.node.selectedNodeEl.on("click", this.onClick);
    this.node.selectedNodeEl.on("dblclick", this.onDblclick);
    this.node.selectedNodeEl.on("mouseover", this.onMouseover);
    this.node.selectedNodeEl.on("mouseout", this.onMouseout);
    this.node.selectedNodeEl.on("contextmenu", this.onContextmenu);
  }
  /** 解除事件 */
  public unbindEvent() {
    this.node.selectedNodeEl.off();
  }
}
