import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import { NodeNotePropsDefine } from "./interface.d";
import Quill, { DeltaStatic } from "quill";
import Delta from "quill-delta";
import "quill/dist/quill.snow.css";
import styles from "./index.module.less";

let quill: Quill | null = null;
let delta = new Delta();

/** 备注弹窗 */
export const NodeNote = defineComponent({
  name: "NodeNote",
  props: NodeNotePropsDefine,
  setup(props, context) {
    const { nodeNoteVisible, position } = props;

    const noteModalRef = ref<HTMLElement>();
    const editorRef = ref<HTMLElement>();

    // 使用 expose 暴露组件内部的方法
    context.expose({ ref: noteModalRef });

    const onDeleteText = () => {
      console.log("onDeleteText");
    };
    const onConfirm = () => {
      if (quill) {
        const res = quill.getContents();
        console.log("res :>> ", res);
      }
      onCancel();
    };
    const onCancel = () => {
      nodeNoteVisible.value = false;
      if (quill) {
        quill.setContents(new Delta().ops as unknown as DeltaStatic);
      }
    };
    onMounted(() => {
      if (noteModalRef.value) {
        // const bbox = noteModalRef.value.getBoundingClientRect();
      }
      window.addEventListener("compositionstart", (event) => {
        console.log("compositionstart", event);
      });
      const editorDom = editorRef.value;
      if (editorDom) {
        quill = new Quill(editorDom, {
          modules: {
            toolbar: ["bold", "italic", "underline", { list: "ordered" }, { list: "bullet" }],
          },
          placeholder: "添加备注",
          theme: "snow",
        });
        // delta.quill.setSelection();
        // quill.on("text-change", (delta, oldDelta, source) => {
        //   console.log("text-change object");
        //   let contents = this.quill.getContents();
        //   let len = contents.ops.length;
        //   // 如果编辑过程中删除所有字符，那么会丢失主题的样式
        //   if (len <= 0 || (len === 1 && contents.ops[0].insert === "\n")) {
        //     this.lostStyle = true;
        //     // 需要删除节点的样式数据
        //     this.syncFormatToNodeConfig(null, true);
        //   } else if (this.lostStyle && !this.isCompositing) {
        //     // 如果处于样式丢失状态，那么需要进行格式化加回样式
        //     this.setTextStyleIfNotRichText(this.node);
        //     this.lostStyle = false;
        //   }
        //   if (source == "api") {
        //     console.log("An API call triggered this change.");
        //   } else if (source == "user") {
        //     console.log("A user action triggered this change.");
        //   }
        //   change = change.compose(delta as unknown as Delta);
        // });

        // // 拦截粘贴，只允许粘贴纯文本
        // quill.clipboard.addMatcher(Node.TEXT_NODE, (node) => {
        //   console.log("node :>> ", node);
        //   // const style = this.getPasteTextStyle();
        //   // return new Delta().insert(node.data, style);
        //   return change.insert(node) as unknown as DeltaStatic;
        // });
        // 拦截粘贴，只允许粘贴纯文本
        quill.clipboard.addMatcher(Node.ELEMENT_NODE, (_node, delta) => {
          delta.ops = (delta.ops || [])
            .filter(({ insert }) => {
              return insert && typeof insert === "string" && insert !== "\n";
            })
            .map((op) => ({ insert: op.insert }));
          return delta;
        });
      }
    });

    onBeforeUnmount(() => {
      quill = null;
    });
    return () => (
      <div
        class={styles.editor_container}
        ref={noteModalRef}
        v-show={nodeNoteVisible.value}
        style={{
          left: position.x + "px",
          top: position.y + "px",
        }}
      >
        <div class={styles.editor_content}>
          <div ref={editorRef}></div>
        </div>
        <div class={styles.btn_group}>
          <div class={styles.delete_btn} onClick={onDeleteText}>
            <i class="icon icon-mind icon-whiteDel"></i>
            <span>删除</span>
          </div>
          <div>
            <el-button color="#1a1a1a" size="small" type="info" round onClick={onConfirm}>
              确定
            </el-button>
            <el-button size="small" round onClick={onCancel}>
              取消
            </el-button>
          </div>
        </div>
      </div>
    );
  },
});
