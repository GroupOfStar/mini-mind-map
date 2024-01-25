import { Emitter } from "./../../emitter";
import type { IEvents } from "./../../graph";
import type { AddIconNode } from "./AddIconNode";
import type { ITypeOfNodeType } from "../index.d";

export class AddIconNodeEvent extends Emitter<IEvents> {
  private _group: AddIconNode["group"];
  private _node?: ITypeOfNodeType;

  constructor(group: AddIconNode["group"]) {
    super();
    this._group = group;
  }
  /** 当前新增按钮挂载的节点 */
  public set node(val: ITypeOfNodeType) {
    this._node = val;
  }
  /** 注册事件 */
  public bindEvent() {
    this.onClick = this.onClick.bind(this);
    this._group.on("click", this.onClick);
  }
  /** 解除事件 */
  public unbindEvent() {
    this._group.off();
  }
  /** 节点点击事件 */
  private onClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    console.log("addIcon click node  :>> ", this._node);
    if (this._node) {
      this.emit("addIcon_click", this._node);
    }
  }
}
