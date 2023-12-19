import type * as SVGType from "@svgdotjs/svg.js";
import type { Graph } from "./Graph";

export class GraphEvent {
  private svg: SVGType.Svg;
  private graphGroup: SVGType.G;
  private isLeftMousedown: boolean;
  private isRightMousedown: boolean;
  private isRightMousemove: boolean;
  private mousedownPos: { x: number; y: number };
  private mousemovePos: { x: number; y: number };
  private mousemoveOffset: { x: number; y: number };

  constructor(props: Graph) {
    this.svg = props.svg;
    this.graphGroup = props.graphGroup;
    this.mousedownPos = {
      x: 0,
      y: 0,
    };
    this.isLeftMousedown = false;
    this.isRightMousemove = false;
    this.isRightMousedown = false;
    this.mousemovePos = {
      x: 0,
      y: 0,
    };
    this.bindEvent();
    this.mousemoveOffset = {
      x: 0,
      y: 0,
    };
  }
  // 绑定事件
  private bindEvent() {
    this.onSvgMousedown = this.onSvgMousedown.bind(this);
    this.onSvgMousewheel = this.onSvgMousewheel.bind(this);
    this.onSvgContextmenu = this.onSvgContextmenu.bind(this);
    this.onWindMousemove = this.onWindMousemove.bind(this);
    this.onWindMouseup = this.onWindMouseup.bind(this);
    this.onWindKeyup = this.onWindKeyup.bind(this);

    this.svg.on("mousedown", this.onSvgMousedown);
    window.addEventListener("mousemove", this.onWindMousemove);
    window.addEventListener("mouseup", this.onWindMouseup);

    this.svg.on("wheel", this.onSvgMousewheel);
    this.svg.on("contextmenu", this.onSvgContextmenu);
    window.addEventListener("keyup", this.onWindKeyup);
  }
  // 解绑事件
  protected unbindEvent() {
    this.svg.off();
    window.removeEventListener("mousemove", this.onWindMousemove);
    window.removeEventListener("mouseup", this.onWindMouseup);

    window.removeEventListener("keyup", this.onWindKeyup);
  }
  // svg画布的鼠标按下事件
  private onSvgMousedown(e: Event) {
    const event = e as MouseEvent;
    event.stopPropagation();
    if (event.which === 1) {
      // 左键
      this.isLeftMousedown = true;
    } else if (event.which === 3) {
      // 右键
      this.isRightMousedown = true;
    }
    this.mousedownPos.x = event.clientX;
    this.mousedownPos.y = event.clientY;
  }
  // 鼠标移动事件
  private onWindMousemove(e: MouseEvent) {
    if (this.isRightMousedown || this.isLeftMousedown) {
      this.mousemovePos.x = e.clientX;
      this.mousemovePos.y = e.clientY;
      this.mousemoveOffset.x = e.clientX - this.mousedownPos.x;
      this.mousemoveOffset.y = e.clientY - this.mousedownPos.y;
      // 如果是鼠标右键按住移动
      if (this.isRightMousedown) {
        const { x, y } = this.mousemoveOffset;
        this.graphGroup.transform({ translateX: x, translateY: y }, false);
      }
      // 鼠标左键按住移动
      if (this.isLeftMousedown) {
        this.isRightMousemove = true;
        // this.emit("mousemove", e, this);
      }
      console.log("onWindMousemove");
    }
  }
  // 鼠标松开事件
  private onWindMouseup(e: MouseEvent) {
    // this.emit("mouseup", e, this);
    // 鼠标起来清除状态
    this.isLeftMousedown = false;
    this.isRightMousemove = false;
    this.isRightMousedown = false;
  }
  // 鼠标右键菜单事件
  private onSvgContextmenu(e: Event) {
    e.preventDefault();
    // this.emit("contextmenu", e);
  }
  // 鼠标滚动
  private onSvgMousewheel(event: Event) {
    const e = event as WheelEvent;
    console.log("onSvgMousewheel e :>> ", e);
    e.stopPropagation();
    e.preventDefault();
    let dir;
    // 解决mac触控板双指缩放方向相反的问题
    if (e.ctrlKey) {
      if (e.deltaY > 0) {
        dir = "up";
      }
      if (e.deltaY < 0) {
        dir = "down";
      }
    } else {
      if (((e as any).wheelDeltaY || e.detail) > 0) {
        dir = "up";
      } else {
        dir = "down";
      }
    }
    // this.emit("mousewheel", e, dir, this);
  }
  // 按键松开事件
  private onWindKeyup(e: KeyboardEvent) {
    console.log("KeyboardEvent e :>> ", e);
    // this.emit("keyup", e);
  }
}
