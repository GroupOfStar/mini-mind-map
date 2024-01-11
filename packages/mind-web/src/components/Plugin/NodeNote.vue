<template>
  <div :class="pop">
    <div
      class="nodeNoteEditorContainer"
      v-if="editorVisible && !isMobile"
      :style="{
        left: left + 'px',
        top: top + 'px',
      }"
    >
      <div class="editor-box" @keyup.stop>
        <mavon-editor
          v-model="note"
          :toolbars="toolbars"
          :subfield="subfield"
          :placeholder="$t('prompt.addRemarks')"
          :fontSize="'12px'"
          :boxShadow="false"
          :language="language"
          :html="false"
        />
      </div>
      <div class="btn-box">
        <div class="delete" @click="clearText">
          <img src="~@/assets/img/svg/hyperLinkDel.svg" alt="" />
          <span>{{ $t("contextmenu.deleteNode") }}</span>
        </div>
        <div>
          <el-button class="btn" size="mini" type="info" round @click="confirm">{{
            $t("prompt.confirm")
          }}</el-button>
          <el-button class="btn" size="mini" round @click="cancel">{{
            $t("prompt.cancel")
          }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 新增节点备注
import { isMobile } from "@/utils";
import { mapState } from "vuex";
import i18n from "@/i18n";
export default {
  name: "NodeNote",
  props: {
    mindMap: {
      type: Object,
    },
  },
  data() {
    return {
      pop: "",
      editorVisible: false,
      editorMobile: false,
      note: "",
      node: null,
      left: 0,
      top: 0,
      language: "",
      subfield: false, // 编辑器双栏true 单栏false
      toolbars: {
        // 工具栏
        bold: true, // 粗体
        italic: true, // 斜体
        underline: true, // 下划线
        ul: true, // 有序列表
        ol: true, // 无序列表
      },
    };
  },
  created() {
    this.language = i18n.locale === "zh" ? "zh-CN" : "en";
    this.$bus.$on("node_click", this.cancel);
    this.$bus.$on("recovery_data", this.cancel);
    this.$bus.$on("del_node", this.cancel);
    this.$bus.$on("draw_click", this.cancel);
    this.$bus.$on("previewHistory", this.cancel);
    this.$bus.$on("recoverHistory", this.cancel);
    this.$bus.$on("expand_btn_click", this.cancel);
    this.$bus.$on("node_contextmenu", this.cancel);
    this.$bus.$on("svg_mousedown", this.cancel);
    this.$bus.$on("open_trigger", this.cancel);
    this.$bus.$on("showNodeNote", this.showNodeNote);
    window.addEventListener("resize", this.cancel);
  },
  beforeDestroy() {
    this.$bus.$off("open_trigger", this.cancel);
    this.$bus.$off("recovery_data", this.cancel);
    this.$bus.$off("del_node", this.cancel);
    this.$bus.$off("node_click", this.cancel);
    this.$bus.$off("draw_click", this.cancel);
    this.$bus.$off("previewHistory", this.cancel);
    this.$bus.$off("recoverHistory", this.cancel);
    this.$bus.$off("expand_btn_click", this.cancel);
    this.$bus.$off("node_contextmenu", this.cancel);
    this.$bus.$off("svg_mousedown", this.cancel);
    this.$bus.$off("showNodeNote", this.showNodeNote);
    window.removeEventListener("resize", this.cancel);
  },
  computed: {
    ...mapState(["isMobile", "lang"]),
  },
  watch: {
    lang(val) {
      this.language = val === "zh" ? "zh-CN" : "en";
    },
  },
  methods: {
    // 清空文本框
    clearText() {
      this.note = "";
      this.confirm();
    },
    showNodeNote(node) {
      this.mindMap.renderer.textEdit.isOutlineNode = true;
      if (!node) {
        return;
      }
      const targetNode = this.mindMap.renderer.getNodeById(this.mindMap.renderer.root, node.id);
      if (targetNode) {
        node = targetNode;
      } else {
        return;
      }
      this.node = node;
      this.note = node.getData("note");
      // 获取节点位置
      const rect = node.group.node.getBoundingClientRect();
      this.top = rect.top + rect.height + 10;
      if (isMobile()) {
        if (rect.left < 250) {
          this.left = rect.left;
        } else {
          this.left = window.innerWidth - 300;
        }
        this.editorMobile = true;
        this.pop = "popBox";
      } else {
        this.left = rect.left + rect.width / 2;
        // 如果left加上弹窗宽度大于视口宽度
        if (this.left + 300 > window.innerWidth) {
          this.left = this.left - 300;
        }
        // 如果top加上弹窗高度大于视口高度
        if (this.top + 205 > window.innerHeight) {
          this.top = this.top - 205 - rect.height - 20;
        }
        // 如果node有子节点
        if (node.children.length > 0) {
          this.left = this.left - 12;
        }
        this.mindMap.keyCommand.pause();
        this.editorVisible = true;
      }
    },
    mobileCancel() {
      this.editorMobile = false;
      this.pop = "";
    },
    // 取消
    cancel() {
      this.mindMap.renderer.textEdit.isOutlineNode = false;
      if (this.editorVisible) {
        this.mindMap.keyCommand.recovery();
      }
      this.editorVisible = false;
    },

    // 确定
    confirm() {
      // 校验节点是否因协同发生变更
      const targetNode = this.mindMap.renderer.getNodeById(
        this.mindMap.renderer.root,
        this.node.id
      );
      if (!targetNode) {
        this.cancel();
        return;
      }
      this.node = targetNode;

      this.node.setNote(this.note);
      this.mobileCancel();
      this.cancel();
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/assets/style/_variables.less";
.nodeNoteEditorContainer {
  position: fixed;
  width: 300px;
  height: 205px;
  background-color: #fff;
  box-shadow: 0 4.38px 17.5px 0 #0000000f;
  border-radius: 10.5px;
  z-index: 999;
  .editor-box {
    width: 300px;
    height: 160px;
    overflow: hidden;
    border-radius: 10.5px;
    /deep/.fa-mavon-bold:before {
      font-family: "icon-mind";
      font-weight: 600;
      content: "\e636";
    }
    /deep/.fa-mavon-italic:before {
      font-family: "icon-mind";
      font-weight: 600;
      content: "\e63f";
    }
    /deep/.fa-mavon-underline:before {
      font-family: "icon-mind";
      font-weight: 600;
      content: "\e633";
    }
    /deep/.fa-mavon-list-ol:before {
      font-family: "icon-mind";
      font-weight: 600;
      content: "\e63e";
    }
    /deep/.fa-mavon-list-ul:before {
      font-family: "icon-mind";
      font-weight: 600;
      content: "\e63a";
    }
    /deep/.v-note-wrapper {
      min-width: 0;
      min-height: 0;
      border: none;
    }
    /deep/.v-note-op {
      border-bottom: none;
      background: #f7f7f7 !important;
    }
    /deep/.op-icon-divider {
      display: none;
    }
    /deep/.v-note-panel {
      padding: 0 10px;
      height: 120px;
      flex: none;
      overflow-y: auto;
    }
    /deep/.v-left-item {
      padding-left: 0;
      text-align: center;
    }
    /deep/.op-icon {
      color: #000 !important;
      font-size: 15px !important;
    }
    /deep/.v-right-item {
      display: none;
    }
    /deep/.content-input-wrapper {
      padding: 3px 10px !important;
    }
  }
  .btn-box {
    width: 280px;
    height: 24.5px;
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .delete {
      cursor: pointer;
      display: flex;
      align-items: center;
      img {
        margin-left: 10px;
        width: 24px;
        height: 24px;
      }
      span {
        font-size: 12px;
        color: #595959;
      }
    }
    .btn {
      width: 64px;
      height: 28px;
      border-radius: 16px;
      line-height: 18px;
      font-size: 12px;
    }
  }
  .arrow-box {
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-bottom: 6px solid #fff;
    position: absolute;
    top: -15px;
    left: 145px;
  }
}
/deep/ .el-input__inner {
  background-color: #f5f5f5;
  height: 44px;
}
</style>
