import { Emitter } from "./../../emitter";
import type { IEvents } from "./../../graph";
import type { ExpandNode } from "./ExpandNode";

export class ExpandNodeEvent extends Emitter<IEvents> {
  private node: ExpandNode;
  constructor(node: ExpandNode) {
    super();
    this.node = node;
  }
  /** 节点点击事件 */
  private onClick(event: Event) {
    event.stopPropagation();
    console.log("expandNode click event  :>> ", event);
    this.emit("expandNode_click", event);
  }
  /** 注册事件 */
  public bindEvent() {
    this.onClick = this.onClick.bind(this);

    this.node.nodeGroup.on("click", this.onClick);
  }
  /** 解除事件 */
  public unbindEvent() {
    this.node.nodeGroup.off();
  }
}
