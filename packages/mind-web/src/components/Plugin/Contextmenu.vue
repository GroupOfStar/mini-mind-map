<template>
  <div
    class="contextmenuContainer listBox"
    v-if="isShow && !isMobile"
    :style="{ left: left + 'px', top: top + 'px' }"
  >
    <template v-if="type === 'node'">
      <div
        class="item"
        @click="exec('INSERT_NODE', insertNodeBtnDisabled)"
        :class="{ disabled: insertNodeBtnDisabled }"
      >
        {{ $t("contextmenu.insertSiblingNode") }}
        <span class="desc">Enter</span>
      </div>
      <div class="item" @click="exec('INSERT_CHILD_NODE')">
        {{ $t("contextmenu.insertChildNode") }}
        <span class="desc">Tab</span>
      </div>
      <div
        class="item"
        @click="exec('ADD_GENERALIZATION')"
        :class="{ disabled: insertNodeBtnDisabled }"
      >
        {{ $t("contextmenu.insertSummary") }}
      </div>
      <div class="line"></div>
      <div
        v-if="toolShow && !showMenu.includes('comment')"
        class="item"
        :class="{ disabled: insertNodeBtnDisabled }"
        @click="showNodeCommentAdd"
      >
        {{ $t("contextmenu.insertComment") }}
        <span class="desc">Ctrl + Shift + R</span>
      </div>
      <div class="item" :class="{ disabled: insertNodeBtnDisabled }" @click="showNodeLink">
        {{ $t("contextmenu.Hyperlink") }}
        <span class="desc">Ctrl + K</span>
      </div>

      <div class="item" @click="showNodeNote" :class="{ disabled: insertNodeBtnDisabled }">
        {{ $t("contextmenu.remarks") }}
        <span class="desc">Ctrl + R</span>
      </div>
      <div class="line"></div>
      <div class="item" @click="exec('UP_NODE')" :class="{ disabled: upNodeBtnDisabled }">
        {{ $t("contextmenu.moveUpNode") }}
        <span class="desc">Ctrl + ↑</span>
      </div>
      <div class="item" @click="exec('DOWN_NODE')" :class="{ disabled: downNodeBtnDisabled }">
        {{ $t("contextmenu.moveDownNode") }}
        <span class="desc">Ctrl + ↓</span>
      </div>
      <div class="line"></div>
      <div
        class="item"
        @click="exec('COPY_NODE', insertNodeBtnDisabled)"
        :class="{ disabled: insertNodeBtnDisabled }"
      >
        {{ $t("contextmenu.copyNode") }}
        <span class="desc">Ctrl + C</span>
      </div>
      <div class="item" :class="{ disabled: copyData === null }" @click="exec('PASTE_NODE')">
        {{ $t("contextmenu.pasteNode") }}
        <span class="desc">Ctrl + V</span>
      </div>
      <div class="item" @click="exec('CUT_NODE')" :class="{ disabled: insertNodeBtnDisabled }">
        {{ $t("contextmenu.cutNode") }}
        <span class="desc">Ctrl + X</span>
      </div>
      <div class="line"></div>
      <div
        class="item danger"
        @click="exec('REMOVE_NODE')"
        :class="{ disabled: insertNodeBtnDisabled }"
      >
        {{ $t("contextmenu.deleteNode") }}
        <span class="desc">Delete</span>
      </div>
    </template>
    <template v-if="type === 'svg'">
      <div class="item" @click="exec('RETURN_CENTER')">
        {{ $t("contextmenu.backCenter") }}
      </div>
      <div class="item" @click="exec('EXPAND_ALL')">
        {{ $t("contextmenu.expandAll") }}
      </div>
      <div class="item" @click="exec('UNEXPAND_ALL')">
        {{ $t("contextmenu.unExpandAll") }}
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { isMobile } from "@/utils";

// 右键菜单
export default {
  name: "Contextmenu",
  props: {
    mindMap: {
      type: Object,
    },
  },
  data() {
    return {
      isShow: false,
      left: 0,
      top: 0,
      node: null,
      copyData: null,
      type: "",
      isMousedown: false,
      mosuedownX: 0,
      mosuedownY: 0,
      isMobile: false,
      toolTop: 0,
      toolLeft: 0,
      boxShow: false,
      genDel: false,
      showCom: true,
      toolClass: "arrowUp",
    };
  },
  computed: {
    ...mapState(["isZenMode", "toolShow", "editType", "showMenu"]),
    insertNodeBtnDisabled() {
      return !this.node || this.node.isRoot;
    },
    upNodeBtnDisabled() {
      if (!this.node || this.node.isRoot) {
        return true;
      }
      const isFirst =
        this.node.parent.children.findIndex((item) => {
          return item === this.node;
        }) === 0;
      return isFirst;
    },
    downNodeBtnDisabled() {
      if (!this.node || this.node.isRoot) {
        return true;
      }
      const children = this.node.parent.children;
      const isLast =
        children.findIndex((item) => {
          return item === this.node;
        }) ===
        children.length - 1;
      return isLast;
    },
  },
  created() {
    this.$bus.$on("backToCenter", this.returnToCenter);
    this.$bus.$on("node_contextmenu", this.show);
    this.$bus.$on("node_click", this.mobileClick);
    this.$bus.$on("draw_click", this.hide);
    this.$bus.$on("expand_btn_click", this.hide);
    this.$bus.$on("svg_mousedown", this.onMousedown);
    this.$bus.$on("mouseup", this.onMouseup);
    window.addEventListener("resize", this.hide);
    window.addEventListener("paste", this.paste);
    this.$bus.$on("data_change", this.hideNode);
    this.$bus.$on("open_trigger", this.hide);
    // 注册快捷键
    this.mindMap.keyCommand.addShortcut("Control+c", this.copy);
    this.mindMap.keyCommand.addShortcut("Control+x", this.cut);
    this.mindMap.keyCommand.addShortcut("Control+k", this.showNodeLink);
    this.mindMap.keyCommand.addShortcut("Control+r", this.showNodeNote);
    this.mindMap.keyCommand.addShortcut("Control+Shift+r", this.showNodeCommentAdd);
  },
  beforeDestroy() {
    this.$bus.$off("open_trigger", this.hide);
    this.$bus.$off("data_change", this.hideNode);
    this.$bus.$off("node_contextmenu", this.show);
    this.$bus.$off("node_click", this.mobileClick);
    this.$bus.$off("draw_click", this.hide);
    this.$bus.$off("expand_btn_click", this.hide);
    this.$bus.$off("svg_mousedown", this.onMousedown);
    this.$bus.$off("mouseup", this.onMouseup);
    window.removeEventListener("resize", this.hide);
    window.removeEventListener("paste", this.paste);
    // 移除快捷键
    this.mindMap.keyCommand.removeShortcut("Control+c", this.copy);
    this.mindMap.keyCommand.removeShortcut("Control+x", this.cut);
    this.mindMap.keyCommand.removeShortcut("Control+k", this.showNodeLink);
    this.mindMap.keyCommand.removeShortcut("Control+r", this.showNodeNote);
    this.mindMap.keyCommand.removeShortcut("Control+Shift+r", this.showNodeCommentAdd);
  },
  methods: {
    ...mapMutations(["setLocalConfig", "setActiveSidebar"]),
    hideNode(data, commandName) {
      if (commandName === "REMOVE_NODE") {
        this.hide();
      }
    },
    mobileClick(node) {
      if (isMobile()) {
        this.boxShow = false;
        this.genDel = false;
        if (node.isRoot) {
          this.boxShow = true;
        }
        if (node.isGeneralization) {
          this.genDel = true;
        }

        const scale = this.mindMap.view.scale;
        const rect = node.group.node.getBoundingClientRect();
        // 工具栏的宽度
        const toolsBoxWidth = 290;
        // 工具栏的高度
        const toolsBoxHeight = 90;
        this.top = rect.top + node.height * scale + 20;
        this.left = rect.left + (node.width * scale) / 2 - toolsBoxWidth / 2;
        this.toolTop = rect.top + node.height * scale + 6;
        this.toolLeft = rect.left + (node.width * scale) / 2;
        this.isMobile = true;
        this.node = node;
        const innerWidth = window.innerWidth;
        const innerHeight = window.innerHeight;
        // 节点靠近左侧临界值
        if (this.left < 10) {
          this.left = 10;
          if (rect.left + 20 < this.left) {
            this.toolLeft = this.left + 10;
          } else {
            this.toolLeft = rect.left + (node.width * scale) / 2;
          }
        } else if (rect.left + toolsBoxWidth > innerWidth) {
          // 节点靠近右侧临界值
          this.left = innerWidth - toolsBoxWidth;
          if (rect.left + 20 > innerWidth) {
            this.toolLeft = rect.left - 10;
          } else {
            this.toolLeft = rect.left + (node.width * scale) / 2 - 25;
          }
        }
        // 节点靠近底部临界值
        if (this.top + 70 > innerHeight) {
          this.toolClass = "arrowDown";
          this.top = rect.top - toolsBoxHeight + 5;
          this.toolTop = this.top + toolsBoxHeight - 20;
        } else {
          this.toolClass = "arrowUp";
        }
        this.$bus.$emit("close_trigger");
      } else {
        this.hide();
      }
    },
    // 节点右键显示
    returnToCenter() {
      this.exec("RETURN_CENTER");
    },
    show(e, node) {
      if (isMobile()) {
        return;
      }
      const curNode = this.mindMap.renderer.getNodeById(this.mindMap.renderer.root, node.id);
      if (!curNode) {
        return;
      }
      this.setActiveSidebar("");
      this.type = "node";
      // 如果left加上弹窗宽度大于视口宽度
      if (e.clientX + 245 + 10 > window.innerWidth) {
        this.left = e.clientX - 245;
      } else {
        this.left = e.clientX + 10;
      }
      // 如果top加上弹窗高度大于视口高度
      if (e.clientY > 420) {
        this.top = e.clientY - 420;
      } else {
        this.top = 20;
      }
      this.isShow = true;
      this.node = curNode;
    },

    // 鼠标按下事件
    onMousedown(e) {
      if (e.which !== 3) {
        return;
      }
      this.mosuedownX = e.clientX;
      this.mosuedownY = e.clientY;
      this.isMousedown = true;
    },

    // 鼠标松开事件
    onMouseup(e) {
      if (!this.isMousedown) {
        return;
      }
      this.isMousedown = false;
      if (Math.abs(this.mosuedownX - e.clientX) > 3 || Math.abs(this.mosuedownY - e.clientY) > 3) {
        this.hide();
        return;
      }
      this.show2(e);
    },

    // 画布右键显示
    show2(e) {
      this.setActiveSidebar("");
      this.type = "svg";
      // 如果left加上弹窗宽度大于视口宽度
      if (e.clientX + 245 + 10 > window.innerWidth) {
        this.left = e.clientX - 245;
      } else {
        this.left = e.clientX + 10;
      }
      // 如果top加上弹窗高度大于视口高度
      if (e.clientY + 154 + 10 > window.innerHeight) {
        this.top = e.clientY - 154;
      } else {
        this.top = e.clientY + 10;
      }
      this.isShow = true;
    },

    // 隐藏
    hide() {
      this.isMobile = false;
      this.isShow = false;
      this.toolTop = 0;
      this.toolLeft = 0;
      this.left = 0;
      this.top = 0;
      this.type = "";
    },

    // 执行命令
    exec(key, disabled, ...args) {
      if (this.boxShow && key !== "PASTE_NODE") {
        return;
      }
      if (disabled) {
        return;
      }
      switch (key) {
        case "COPY_NODE":
          this.copyData = this.mindMap.renderer.copyNode();
          // 清除复制的节点以及其子节点的评论数据
          if (this.copyData) {
            this.clearCopyDataComment(this.copyData);
            this.jsCopy(this.copyData, "copy");
          }
          break;
        case "COPY_NODE_IMG":
          {
            const firstNode = this.mindMap.renderer.activeNodeList[0];
            if (firstNode) {
              const { pid, id, data } = firstNode.nodeData;
              this.jsCopy([{ pid, id, data }], "copy", "mindDataImg");
            }
          }
          break;
        case "CUT_NODE":
          this.$bus.$emit("execCommand", key, (copyData) => {
            this.copyData = copyData;
            this.jsCopy(this.copyData, "cut");
          });
          break;
        case "PASTE_NODE":
          this.$bus.$emit("execCommand", key, this.copyData);
          break;
        case "RETURN_CENTER":
          this.mindMap.view.resetCenter();
          break;
        case "TOGGLE_ZEN_MODE":
          this.setValue();
          break;
        default:
          this.$bus.$emit("execCommand", key, ...args);
          break;
      }
      this.hide();
    },
    async setValue() {
      const isZenMode = !this.isZenMode;
      this.setLocalConfig(isZenMode);
      this.$bus.$emit("isZend");
    },
    // 浏览器复制
    jsCopy(data, type, dataType = "mindData") {
      const copyData = { dataType, type, data };
      const value = JSON.stringify(copyData);
      const input = document.createElement("input");
      input.setAttribute("value", value);
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    },
    // 复制
    copy() {
      const nodeWrapperEl = document.querySelector(".node-img-stretch");
      const isNodeImgSelect = nodeWrapperEl && nodeWrapperEl.style.display === "block";
      if (isNodeImgSelect) {
        this.exec("COPY_NODE_IMG");
      } else {
        this.exec("COPY_NODE");
      }
    },

    // 清除复制的节点以及其子节点的评论数据
    clearCopyDataComment(nodes) {
      nodes.forEach((node) => {
        if (node.data.commentInfo?.num) {
          node.data.commentInfo = {};
        }
        if (node.children?.length > 0) {
          node.children.forEach((item) => {
            this.clearCopyDataComment([item]);
          });
        }
      });
    },
    // 粘贴图片
    pasteImg(event, items) {
      const imgFile = Array.from(items).find(
        (ele) => ele.kind === "file" && ele.type.includes("image/")
      );
      if (imgFile) {
        const file = imgFile.getAsFile();
        const activeNodeList = this.mindMap.renderer.activeNodeList;
        // 选中节点
        if (activeNodeList.length) {
          // 更新节点图片
          this.mindMap.emit("dragImgUpload", file, activeNodeList[0]);
        } else {
          // 选中画布，创建新节点并上传图片
          this.mindMap.delegateDrag.createImgNode(event, file);
        }
      }
    },
    // 通过图片url粘贴图片
    pasteImgByNodeData(event, nodeData) {
      const imgUrl = nodeData.data.image;
      if (imgUrl) {
        const activeNodeList = this.mindMap.renderer.activeNodeList;
        // 选中节点
        if (activeNodeList.length) {
          // 更新节点图片
          const node = activeNodeList[0];
          // 检查node节点是否还存在
          let currentNodeData = this.mindMap.renderer.getNodeById(
            this.mindMap.renderer.root,
            node.id || node.generalizationBelongNode.id
          );
          if (currentNodeData) {
            if (node.isGeneralization) {
              currentNodeData = currentNodeData.generalizationNode;
            }
            currentNodeData.setImage(
              {
                direction: currentNodeData.nodeData.data.imageDirection || "top",
                url: nodeData.data.image,
                title: nodeData.data.imageTitle,
                width: nodeData.data.imageSize.width,
                height: nodeData.data.imageSize.height,
                custom: nodeData.data.imageSize.custom,
              },
              false
            );
          }
        } else {
          // 选中画布，创建新节点并上传图片
          this.mindMap.delegateDrag.createImgNodeByData(event, nodeData);
        }
      }
    },
    // 粘贴节点
    pasteNode(event, browserData) {
      // 暂停快捷时不做粘贴处理
      if (this.mindMap.keyCommand.isPause) {
        return;
      }
      const type = this.mindMap.renderer.waitingPasteData.type;
      // 需要判断剪贴板的数据是否是我们需要的脑图数据
      if (typeof browserData !== "object" && browserData.dataType !== "mindData") {
        return;
      }
      // 目前不支持跨浏览器剪切
      if (
        (!type && browserData.type === "cut") ||
        (type === "copy" && browserData.type === "cut")
      ) {
        return;
      }
      this.copyData = browserData;
      this.exec("PASTE_NODE");
    },
    // 节点和大纲禁止粘贴节点数据和图片
    unablePaste(event, browserData, items) {
      const targetName = event.target.className;
      // 粘贴到文本编辑框|大纲
      if (targetName.includes("text-edit-box") || targetName.includes("nodeEdit")) {
        // 节点数据禁止粘贴
        if (browserData.dataType === "mindData") {
          // 阻止默认粘贴操作
          event.preventDefault();
          return false;
        } else if (Array.from(items).some((ele) => ele.type.includes("image"))) {
          // 阻止默认粘贴操作
          event.preventDefault();
          return true;
        }
      } else {
        return true;
      }
    },
    // 粘贴
    paste(event) {
      // 只读模式禁用粘贴
      if (this.mindMap.opt.readonly) {
        return;
      }
      // 获取剪切版的数据
      const copyData = (event.clipboardData || window.clipboardData).getData("text");
      let browserData = copyData;
      if (copyData && this.mindMap.renderer.isJSON(copyData)) {
        browserData = JSON.parse(copyData);
      }
      // 获取图片数据
      const items = (event.clipboardData || event.originalEvent.clipboardData).items;
      const pasteEnable = this.unablePaste(event, browserData, items);
      if (pasteEnable) {
        const { dataType, data } = browserData;
        // 复制的是节点上的图片
        if (dataType === "mindDataImg" && Array.isArray(data) && data[0]) {
          event.preventDefault();
          // 通过url粘贴图片
          this.pasteImgByNodeData(event, data[0]);
        } else {
          // 粘贴节点
          this.pasteNode(event, browserData);
          // 粘贴图片
          this.pasteImg(event, items);
        }
      }
    },

    // 剪切
    cut() {
      this.exec("CUT_NODE");
    },

    // 插入评论
    showNodeCommentAdd() {
      if (!this.node) {
        if (this.mindMap.renderer.activeNodeList.length > 0) {
          const node = this.mindMap.renderer.activeNodeList[0];
          // 根节点或者概要节点阻止添加评论
          if (node.isRoot || node.isGeneralization) {
            return;
          }
          this.$bus.$emit("showNodeCommentAdd", node);
        }
        return;
      }
      // 根节点或者概要节点阻止添加评论
      if (this.node.isRoot || this.node.isGeneralization) {
        this.node = null;
        return;
      }
      this.$bus.$emit("showNodeCommentAdd", this.node);
      this.hide();
      this.node = null;
    },

    // 插入超链接
    showNodeLink() {
      if (!this.node) {
        if (this.mindMap.renderer.activeNodeList.length > 0) {
          const node = this.mindMap.renderer.activeNodeList[0];
          // 根节点或者概要节点阻止添加链接
          if (node.isRoot || node.isGeneralization) {
            return;
          }
          this.$bus.$emit("showNodeLink", node);
        }
        return;
      }
      // 根节点或者概要节点阻止添加链接
      if (this.node.isRoot || this.node.isGeneralization) {
        this.node = null;
        return;
      }
      this.$bus.$emit("showNodeLink", this.node);
      this.hide();
      this.node = null;
    },

    // 插入备注
    showNodeNote() {
      if (!this.node) {
        if (this.mindMap.renderer.activeNodeList.length > 0) {
          const node = this.mindMap.renderer.activeNodeList[0];
          // 根节点或者概要节点阻止添加备注
          if (node.isRoot || node.isGeneralization) {
            return;
          }
          this.$bus.$emit("showNodeNote", node);
        }
        return;
      }
      // 根节点或者概要节点阻止添加备注
      if (this.node.isRoot || this.node.isGeneralization) {
        this.node = null;
        return;
      }
      this.$bus.$emit("showNodeNote", this.node);
      this.hide();
      this.node = null;
    },
    // 打开键盘
    showKeyboard() {
      this.mindMap.emit("node_dblclick", this.node);
      this.hide();
      this.node = null;
    },
  },
};
</script>

<style lang="less" scoped></style>
