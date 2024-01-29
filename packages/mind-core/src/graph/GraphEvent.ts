import { Polygon } from "@svgdotjs/svg.js";
import { Emitter } from "./../emitter";
import type { IEvents } from "./../graph/index.d";
import type { Graph } from "./Graph";
import type { RootNode, SecondNode, DefaultNode } from "./../node";
import type { ITypeOfNodeType } from "./../node/index.d";
import { nodeTreeToTextTree, uniqueTreeNode } from "./../utils";

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
    this.onSvgMousemove = this.onSvgMousemove.bind(this);
    this.onSvgMouseup = this.onSvgMouseup.bind(this);
    this.onSvgMousewheel = this.onSvgMousewheel.bind(this);
    this.onSvgContextmenu = this.onSvgContextmenu.bind(this);

    this.onNodeClick = this.onNodeClick.bind(this);
    this.onCtrlNodeClick = this.onCtrlNodeClick.bind(this);

    this.onDocumentKeydown = this.onDocumentKeydown.bind(this);
    this.onDocumentCopy = this.onDocumentCopy.bind(this);
    this.onDocumentPaste = this.onDocumentPaste.bind(this);

    this.graph.svg.on("click", this.onSvgClick);
    this.graph.svg.on("mousedown", this.onSvgMousedown);
    this.graph.svg.on("mousemove", this.onSvgMousemove);
    this.graph.svg.on("mouseup", this.onSvgMouseup);

    // this.graph.svg.on("wheel", this.onSvgMousewheel);
    this.graph.svg.on("contextmenu", this.onSvgContextmenu);
    // this.graph.svg.on("copy", this.onSvgCopy);

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
    const { activatedNode, addIconNode } = this.graph;
    // 取消节点的激活效果
    activatedNode.clear();
    // 隐藏新增按钮
    addIconNode.onHide();
    document.removeEventListener("keydown", this.onDocumentKeydown);
    document.removeEventListener("copy", this.onDocumentCopy);
    document.removeEventListener("paste", this.onDocumentPaste);
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
    document.createElement("div").addEventListener("paste", () => {});
  }
  // 键盘按下事件
  private onDocumentKeydown(e: KeyboardEvent) {
    const { key } = e;
    console.log("onDocumentKeydown e :>> ", e);
    if (key === "Tab" || key === "Enter" || key === "Delete") {
      e.preventDefault();
      e.stopPropagation();
      const { activatedNode } = this.graph;
      const prevNode = activatedNode.firstNode;
      console.log("prevNode :>> ", prevNode);
      console.log("prevNode?.group.rbox() :>> ", prevNode?.group.rbox());
      const { x = 0, y = 0, width = 0, height = 0 } = prevNode?.group.rbox() || {};
      let newNode: RootNode | SecondNode | DefaultNode | undefined;
      switch (key) {
        case "Tab":
          newNode = prevNode?.addChildNode();
          break;
        case "Enter":
          newNode = prevNode?.addBrotherNode();
          break;
        case "Delete":
          newNode = prevNode?.deleteActivatedNode();
          break;
      }
      console.log("newNode :>> ", newNode);
      if (newNode) {
        this.graph.doLayout();
        this.graph.onResize(prevNode, { offsetX: x + width / 2, offsetY: y + height / 2 });
        activatedNode.keepOne(newNode);
      }
    }
  }
  // 复制事件
  private onDocumentCopy(e: ClipboardEvent) {
    e.preventDefault();
    e.stopPropagation();

    const activatedNodes = this.graph.activatedNode.nodes;
    console.log("activatedNodes :>> ", activatedNodes);
    // 根节点不允许复制，过滤掉
    // 要考虑复制的多节点构成树，方案 1.循环处理查找；2.可以考虑先平铺，去重后再组装
    // TODO

    // 去重后的节点数组
    const nodeList = uniqueTreeNode([...activatedNodes]);
    console.log("nodeList :>> ", nodeList);

    console.log("treeText :>> ", nodeTreeToTextTree(nodeList));

    e.clipboardData?.setData("application/json", '{"age":11,"name":"gag","args":["22"]}');
    e.clipboardData?.setData("text/plain", "文本文本文本");
    e.clipboardData?.setData("custom/type", "gasgasgasdgasdg");

    // const blob = new Blob(["text/plain", "text/plain22"], { type: "text/plain" });
    // const data = [new ClipboardItem({ ["text/plain"]: blob })];
    // navigator.clipboard.write(data).then(
    //   () => {
    //     /* success */
    //     navigator.clipboard.readText().then((text) => {
    //       console.log("text :>> ", text);
    //     });
    //     navigator.clipboard.read().then((res) => {
    //       console.log("res :>> ", res);
    //     });
    //   },
    //   () => {
    //     /* failure */
    //   }
    // );
  }
  // 粘贴事件
  private onDocumentPaste(e: ClipboardEvent) {
    console.log("e :>> ", e);
    e.preventDefault();
    e.stopPropagation();
    const clipboardData = e.clipboardData || new DataTransfer();
    console.log("clipboardData:>> ", clipboardData);
    const textData = clipboardData.getData("text/plain");
    console.log("textData :>> ", textData);
    const htmlData = clipboardData.getData("text/html");
    console.log("htmlData :>> ", htmlData);
    const jsonData = clipboardData.getData("application/json");
    console.log("jsonData :>> ", jsonData);
    const customData = clipboardData.getData("custom/type");
    console.log("customData :>> ", customData);
    console.log("clipboardData.files :>> ", clipboardData.files);
    if (clipboardData.files.length > 0) {
      const file = clipboardData.files[0];
      console.log("file :>> ", file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = document.createElement("img");
        console.log("event.target :>> ", event.target);
        img.src = (event.target?.result || "").toString();
        // document.body.appendChild(img);
        // console.log("img :>> ", img);
      };
      reader.readAsDataURL(file);
    }
    console.log("clipboardData.items :>> ", clipboardData.items);
    console.log("clipboardData.types :>> ", clipboardData.types);
  }
  // 节点点击事件
  private onNodeClick(node: ITypeOfNodeType) {
    const { activatedNode, addIconNode } = this.graph;
    activatedNode.keepOne(node);
    document.addEventListener("keydown", this.onDocumentKeydown);
    document.addEventListener("copy", this.onDocumentCopy);
    document.addEventListener("paste", this.onDocumentPaste);
  }
  /**
   * 组合键：ctrl + 鼠标点击节点事件
   * @param node
   */
  private onCtrlNodeClick(node: ITypeOfNodeType) {
    const { activatedNode, addIconNode } = this.graph;
    if (activatedNode.has(node)) {
      activatedNode.delete(node);
    } else {
      activatedNode.add(node);
    }
    addIconNode.onHide();
    document.removeEventListener("keydown", this.onDocumentKeydown);
    document.addEventListener("copy", this.onDocumentCopy);
    document.addEventListener("paste", this.onDocumentPaste);
  }
}
