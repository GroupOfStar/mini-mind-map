import { Polygon } from "@svgdotjs/svg.js";
import type * as SVGType from "@svgdotjs/svg.js";
import type { Graph } from "./Graph";

export class GraphEvent {
  private graph: Graph;
  private selectRect: SVGType.Polygon;

  private isLeftMousedown: boolean;
  private isLeftMousemove: boolean;
  private isRightMousedown: boolean;
  private isRightMousemove: boolean;
  private mousedownPos: { x: number; y: number };
  private mousemovePos: { x: number; y: number };
  private allowMoveSize: { leftX: number; rightX: number; topY: number; bottomY: number };

  constructor(graph: Graph) {
    this.graph = graph;
    this.selectRect = new Polygon();
    this.selectRect.stroke({ color: "#0984e3" });
    this.selectRect.fill({ color: "rgba(9,132,227,0.15)" });
    this.selectRect.addTo(graph.svg);

    this.isLeftMousedown = false;
    this.isLeftMousemove = false;
    this.isRightMousedown = false;
    this.isRightMousemove = false;
    this.mousemovePos = { x: 0, y: 0 };
    this.mousedownPos = { x: 0, y: 0 };
    this.allowMoveSize = { leftX: 0, rightX: 0, topY: 0, bottomY: 0 };
    this.bindEvent();
  }
  // 鼠标按住拖动的位移
  get mousemoveOffset() {
    return {
      x: this.mousemovePos.x - this.mousedownPos.x,
      y: this.mousemovePos.y - this.mousedownPos.y,
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

    this.graph.svg.on("mousedown", this.onSvgMousedown);
    window.addEventListener("mousemove", this.onWindMousemove);
    window.addEventListener("mouseup", this.onWindMouseup);

    this.graph.svg.on("wheel", this.onSvgMousewheel);
    this.graph.svg.on("contextmenu", this.onSvgContextmenu);
    window.addEventListener("keyup", this.onWindKeyup);
  }
  // 解绑事件
  protected unbindEvent() {
    this.graph.svg.off();
    window.removeEventListener("mousemove", this.onWindMousemove);
    window.removeEventListener("mouseup", this.onWindMouseup);

    window.removeEventListener("keyup", this.onWindKeyup);
  }
  // svg画布的鼠标按下事件
  private onSvgMousedown(e: Event) {
    const event = e as MouseEvent;
    event.stopPropagation();
    // 0表示左键, 1表示中键, 2表示右键
    switch (event.button) {
      case 0:
        this.isLeftMousedown = true;
        this.selectRect.plot([[event.clientX, event.clientY]]);
        break;
      case 1:
        break;
      case 2:
        this.isRightMousedown = true;
        // graphTranslate 记录节点组开始的Transform
        const { translateX = 0, translateY = 0 } = this.graph.graphGroup.transform();
        /**
         * allowMoveSize 记录不超出边界情况下的允许移动的距离
         * 边界就是保证可视区域的1/4区域里有节点组
         */
        const graphX = this.graph.graphGroup.x() as number;
        const graphY = this.graph.graphGroup.y() as number;
        const width = this.graph.graphGroup.width() as number;
        const height = this.graph.graphGroup.height() as number;
        this.allowMoveSize = {
          leftX: window.innerWidth / 2 - width - graphX - translateX,
          rightX: window.innerWidth / 2 - graphX - translateX,
          topY: window.innerHeight / 2 - height - graphY - translateY,
          bottomY: window.innerHeight / 2 - graphY - translateY,
        };
        break;
    }
    this.mousedownPos.x = event.clientX;
    this.mousedownPos.y = event.clientY;
  }
  // 鼠标移动事件
  private onWindMousemove(e: MouseEvent) {
    if (this.isRightMousedown || this.isLeftMousedown) {
      this.mousemovePos.x = e.clientX;
      this.mousemovePos.y = e.clientY;
      // 如果是鼠标右键按住移动
      if (this.isRightMousedown) {
        this.isRightMousemove = true;
        const { leftX, rightX, topY, bottomY } = this.allowMoveSize;
        if (
          this.mousemoveOffset.x > leftX &&
          this.mousemoveOffset.x < rightX &&
          this.mousemoveOffset.y > topY &&
          this.mousemoveOffset.y < bottomY
        ) {
          // const translateX = this.graphTranslate.translateX + this.mousemoveOffset.x;
          // const translateY = this.graphTranslate.translateY + this.mousemoveOffset.y;
          // this.graph.graphGroup.transform({ translateX, translateY });
          this.graph.graphGroup.translate(e.movementX, e.movementY);
        }
      }
      // 鼠标左键按住移动
      if (this.isLeftMousedown) {
        this.isLeftMousemove = true;
        const { x, y } = this.mousemoveOffset;
        this.selectRect.plot([
          [this.mousedownPos.x, this.mousedownPos.y],
          [this.mousedownPos.x + x, this.mousedownPos.y],
          [e.clientX, e.clientY],
          [this.mousedownPos.x, this.mousedownPos.y + y],
        ]);
        // this.emit("mousemove", e, this);
      }
    }
  }
  // 鼠标松开事件, 清除状态
  private onWindMouseup(e: MouseEvent) {
    e.stopPropagation();
    // this.emit("mouseup", e, this);
    if (this.isLeftMousedown && this.isLeftMousemove) {
      this.selectRect.plot([]);
    }
    this.isLeftMousedown = false;
    this.isLeftMousemove = false;
    this.isRightMousedown = false;
    this.isRightMousemove = false;
  }
  // 鼠标右键菜单事件
  private onSvgContextmenu(e: Event) {
    e.preventDefault();
    this.graph.emit("graph_contextmenu", e);
  }
  // 鼠标滚动
  private onSvgMousewheel(event: Event) {
    const e = event as WheelEvent;
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
    // console.log("e.key :>> ", e.key);
    // console.log("KeyboardEvent e :>> ", e);
    // this.emit("keyup", e);
  }
}
