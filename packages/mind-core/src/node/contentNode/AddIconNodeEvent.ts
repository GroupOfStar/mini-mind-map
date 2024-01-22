import { Emitter } from "./../../emitter";
import type { IEvents } from "./../../graph";
import type { AddIconNode } from "./AddIconNode";

export class AddIconNodeEvent extends Emitter<IEvents> {
  private node: AddIconNode;
  constructor(node: AddIconNode) {
    super();
    this.node = node;
  }
  /** 注册事件 */
  public bindEvent() {
    this.onClick = this.onClick.bind(this);
    this.node.group.on("click", this.onClick);
  }
  /** 解除事件 */
  public unbindEvent() {
    this.node.group.off();
  }
  /** 节点点击事件 */
  private onClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    console.log("addIcon click event  :>> ", event);
    this.emit("addIcon_click", event);
  }
}
