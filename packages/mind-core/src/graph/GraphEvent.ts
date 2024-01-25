import { Polygon } from "@svgdotjs/svg.js";
import { Emitter } from "./../emitter";
import type { IEvents } from "./../graph/index.d";
import type { Graph } from "./Graph";
import type { ITypeOfNodeType } from "./../node/index.d";

export class GraphEvent extends Emitter<IEvents> {
  private graph: Graph;
  private selectRect = new Polygon();

  private mousedownEvent = new MouseEvent("svg");
  private isLeftMousedown = false;
  private isLeftMousemove = false;
  private isRightMousedown = false;

  constructor(graph: Graph) {
    super();
    this.graph = graph;
    graph.el.style.cursor = "default";
    this.selectRect.stroke({ color: "#0984e3" });
    this.selectRect.fill({ color: "rgba(9,132,227,0.15)" });
    this.selectRect.addTo(graph.svg);

    this.bindEvent();
  }
  // 绑定事件
  public bindEvent() {
    this.onSvgClick = this.onSvgClick.bind(this);
    this.onSvgMousedown = this.onSvgMousedown.bind(this);
    this.onSvgMousewheel = this.onSvgMousewheel.bind(this);
    this.onSvgContextmenu = this.onSvgContextmenu.bind(this);
    this.onSvgMousemove = this.onSvgMousemove.bind(this);
    this.onSvgMouseup = this.onSvgMouseup.bind(this);
    this.onNodeClick = this.onNodeClick.bind(this);
    this.onCtrlNodeClick = this.onCtrlNodeClick.bind(this);
    this.onWindowKeydown = this.onWindowKeydown.bind(this);

    this.graph.svg.on("click", this.onSvgClick);
    this.graph.svg.on("mousedown", this.onSvgMousedown);
    this.graph.svg.on("mousemove", this.onSvgMousemove);
    this.graph.svg.on("mouseup", this.onSvgMouseup);

    // this.graph.svg.on("wheel", this.onSvgMousewheel);
    this.graph.svg.on("contextmenu", this.onSvgContextmenu);

    // 节点点击事件
    this.on("node_click", this.onNodeClick);

    // 组合键事件
    this.on("ctrl_node_click", this.onCtrlNodeClick);
  }
  // 解绑事件
  public unbindEvent() {
    this.graph.svg.off();
    this.off("*");
  }
  /** 画布点击事件 */
  private onSvgClick(e: Event) {
    const event = e as MouseEvent;
    event.stopPropagation();
    this.emit("graph_click", event);
    const { activatedNodes, addIconNode } = this.graph;
    // 取消节点的激活效果
    activatedNodes.clear();
    // 隐藏新增按钮
    addIconNode.onHide();
    document.removeEventListener("keydown", this.onWindowKeydown);
  }
  // svg画布的鼠标按下事件
  private onSvgMousedown(e: Event) {
    const event = e as MouseEvent;
    event.stopPropagation();
    this.mousedownEvent = event;
    // 0表示左键, 1表示中键, 2表示右键
    switch (event.button) {
      case 0:
        this.isLeftMousedown = true;
        break;
      case 1:
        break;
      case 2:
        this.isRightMousedown = true;
        this.graph.el.style.cursor = "grab";
        break;
    }
  }
  // 鼠标移动事件
  private onSvgMousemove(e: Event) {
    e.stopPropagation();
    // 鼠标左键按住移动
    if (this.isLeftMousedown) {
      this.isLeftMousemove = true;
      const { offsetX: moveOffsetX, offsetY: moveOffsetY } = e as MouseEvent;
      const { offsetX, offsetY } = this.mousedownEvent;
      // 左上 右上 右下 左下
      this.selectRect.plot([
        [offsetX, offsetY],
        [moveOffsetX, offsetY],
        [moveOffsetX, moveOffsetY],
        [offsetX, moveOffsetY],
      ]);
      // 如果是鼠标右键按住移动
    } else if (this.isRightMousedown) {
      this.graph.el.style.cursor = "grabbing";
      const { movementX, movementY } = e as MouseEvent;
      this.graph.el.scrollBy(-movementX, -movementY);
    }
  }
  // 鼠标松开事件, 清除状态
  private onSvgMouseup(e: Event) {
    e.stopPropagation();
    this.graph.el.style.cursor = "default";
    // this.emit("mouseup", e, this);
    if (this.isLeftMousedown && this.isLeftMousemove) {
      this.selectRect.plot([]);
    }
    this.isLeftMousedown = false;
    this.isLeftMousemove = false;
    this.isRightMousedown = false;
  }
  // 鼠标右键菜单事件
  private onSvgContextmenu(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.emit("graph_contextmenu", e);
  }
  // 鼠标滚动
  private onSvgMousewheel(event: Event) {
    const e = event as WheelEvent;
    e.preventDefault();
    e.stopPropagation();
    // this.emit("mousewheel", e, dir, this);
  }
  // 键盘按下事件
  private onWindowKeydown(e: KeyboardEvent) {
    const { key } = e;
    console.log("onWindowKeydown e :>> ", e);
    if (key === "Tab" || key === "Enter" || key === "Delete") {
      e.preventDefault();
      e.stopPropagation();
      const { activatedNodes, rootNode } = this.graph;
      switch (key) {
        case "Tab":
          activatedNodes.firstNode?.addChildNode();
          this.graph.layout();
        case "Enter":
          console.log("rootNode :>> ", rootNode);
        case "Delete":
        // activatedNodes.firstNode?.removeNode();
      }
    }
  }
  // 节点点击事件
  private onNodeClick(node: ITypeOfNodeType) {
    const { activatedNodes, addIconNode } = this.graph;
    activatedNodes.keepOne(node);
    // 显示新增按钮 并注册相关快捷键
    addIconNode.onShowByNode(node);
    document.addEventListener("keydown", this.onWindowKeydown);
  }
  /**
   * 组合键：ctrl + 鼠标点击节点事件
   * @param node
   */
  private onCtrlNodeClick(node: ITypeOfNodeType) {
    const { activatedNodes, addIconNode } = this.graph;
    if (activatedNodes.has(node)) {
      activatedNodes.delete(node);
    } else {
      activatedNodes.add(node);
    }
    addIconNode.onHide();
    document.removeEventListener("keydown", this.onWindowKeydown);
  }
}
