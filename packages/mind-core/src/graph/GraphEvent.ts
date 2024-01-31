import { Polygon } from "@svgdotjs/svg.js";
import { Emitter } from "./../emitter";
import type { IEvents } from "./../graph/index.d";
import type { Graph } from "./Graph";
import type { RootNode, SecondNode, DefaultNode } from "./../node";
import type { ITypeOfNodeType } from "./../node/index.d";
import { Node } from "./../node";
import { nodeTreeToText, uniqueTreeNode } from "./../utils";

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
    this.onDocumentCut = this.onDocumentCut.bind(this);
    this.onDocumentPaste = this.onDocumentPaste.bind(this);

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
    const { activatedNode, addIconNode } = this.graph;
    // 取消节点的激活效果
    activatedNode.clear();
    // 隐藏新增按钮
    addIconNode.onHide();
    document.removeEventListener("keydown", this.onDocumentKeydown);
    document.removeEventListener("copy", this.onDocumentCopy);
    document.removeEventListener("cut", this.onDocumentCut);
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
    if (
      key === "Tab" ||
      key === "Enter" ||
      key === "Delete" ||
      key === "ArrowUp" ||
      key === "ArrowDown" ||
      key === "ArrowLeft" ||
      key === "ArrowRight"
    ) {
      e.preventDefault();
      e.stopPropagation();
      const { activatedNode, addIconNode } = this.graph;
      const prevNode = activatedNode.firstNode;
      if (prevNode) {
        let newNode: RootNode | SecondNode | DefaultNode | undefined;
        switch (key) {
          case "Tab":
            addIconNode.addChildToNode(prevNode);
            break;
          case "Enter":
            newNode = prevNode.addBrotherNode();
            this.graph.onScrollToNode(prevNode);
            activatedNode.keepOne(newNode);
            break;
          case "Delete":
            newNode = prevNode.deleteActivatedNode();
            this.graph.onScrollToNode(newNode);
            activatedNode.keepOne(newNode);
            break;
          case "ArrowUp":
          case "ArrowDown":
          case "ArrowLeft":
          case "ArrowRight": {
            newNode = activatedNode.firstNode[`get${key}Node`]();
            if (newNode) {
              activatedNode.keepOne(newNode);
            }
            break;
          }
        }
      }
    }
  }
  /**
   * 处理剪切板内容
   * @param e 剪切板event
   * @param nodes 节点数组
   */
  private SetClipboardContent(e: ClipboardEvent, nodes: Set<ITypeOfNodeType>) {
    // 去重后的节点数组, 如果根节点不允许复制，这里还需要过滤掉 TODO
    const nodeList = uniqueTreeNode([...nodes]);
    // 在edrawsoft上能粘贴成节点必须以空格开头
    e.clipboardData?.setData("text/plain", "\u0020" + nodeTreeToText(nodeList));
    // application/json
    e.clipboardData?.setData("mind/node", JSON.stringify(nodeList.map(Node.toRaw)));

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
  // 复制事件
  private onDocumentCopy(e: ClipboardEvent) {
    e.preventDefault();
    e.stopPropagation();
    const { nodes } = this.graph.activatedNode;
    this.SetClipboardContent(e, nodes);
  }
  // 剪切事件
  private onDocumentCut(e: ClipboardEvent) {
    e.preventDefault();
    e.stopPropagation();
    const { activatedNode } = this.graph;
    const { nodes } = activatedNode;
    // 从前往后删的，所以取最后一个返回的，才是存在节点树中的
    const newNode = Array.from(nodes).map((item) => item.deleteActivatedNode())[nodes.size - 1];
    this.graph.onScrollToNode(newNode);
    activatedNode.keepOne(newNode);
    this.SetClipboardContent(e, nodes);
  }
  // 粘贴事件
  private onDocumentPaste(e: ClipboardEvent) {
    console.log("e :>> ", e);
    e.preventDefault();
    e.stopPropagation();
    const clipboardData = e.clipboardData || new DataTransfer();
    const textData = clipboardData.getData("text/plain");
    console.log("textData :>> ", "\n", textData);
    const htmlData = clipboardData.getData("text/html");
    console.log("htmlData :>> ", htmlData);
    const jsonData = clipboardData.getData("application/json");
    console.log("jsonData :>> ", jsonData);
    const mindNode = clipboardData.getData("mind/node");
    console.log("mindNode :>> ", mindNode);
    if (mindNode) {
      const { firstNode } = this.graph.activatedNode;
      if (firstNode) {
        const nodeList = JSON.parse(mindNode);
        firstNode.children = firstNode.children.concat(this.graph.renderNode(nodeList, firstNode));
        this.graph.onScrollToNode(firstNode);
      }
    }

    // console.log("clipboardData.files :>> ", clipboardData.files);
    // if (clipboardData.files.length > 0) {
    //   const file = clipboardData.files[0];
    //   console.log("file :>> ", file);
    //   const reader = new FileReader();
    //   reader.onload = (event) => {
    //     const img = document.createElement("img");
    //     console.log("event.target :>> ", event.target);
    //     img.src = (event.target?.result || "").toString();
    //     // document.body.appendChild(img);
    //     // console.log("img :>> ", img);
    //   };
    //   reader.readAsDataURL(file);
    // }
    // console.log("clipboardData.items :>> ", clipboardData.items);
    console.log("clipboardData.types :>> ", clipboardData.types);
  }
  // 节点点击事件
  private onNodeClick(node: ITypeOfNodeType) {
    const { activatedNode } = this.graph;
    activatedNode.keepOne(node);
    document.addEventListener("keydown", this.onDocumentKeydown);
    document.addEventListener("copy", this.onDocumentCopy);
    document.addEventListener("cut", this.onDocumentCut);
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
    document.addEventListener("cut", this.onDocumentCut);
    document.addEventListener("paste", this.onDocumentPaste);
  }
}
