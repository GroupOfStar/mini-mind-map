import { defineComponent, onMounted, PropType, Ref } from "vue";
import type { Graph } from "@mini-mind-map/mind-core";
import styles from "./index.module.less";

/** Contextmenu组件propsType */
const ContextMenuPropsDefine = {
  /** 数据集 */
  mindMap: {
    type: Object as PropType<Graph>,
    required: true,
  },
  nodeNoteVisible: {
    type: Object as PropType<Ref<boolean>>,
    required: true,
  },
  contextMenuVisible: {
    type: Object as PropType<Ref<boolean>>,
    required: true,
  },
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
} as const;

/** 右键菜单组件 */
export const ContextMenu = defineComponent({
  name: "ContextMenu",
  props: ContextMenuPropsDefine,
  setup(props) {
    const exec = (type: "INSERT_NODE") => {
      console.log("type :>> ", type);
    };
    const addNodeNote = () => {
      props.contextMenuVisible.value = false;
      props.nodeNoteVisible.value = true;
    };
    onMounted(() => {});
    return () => (
      <div
        v-show={props.contextMenuVisible.value}
        class={styles.contextMenuContainer}
        style={{ left: props.x + "px", top: props.y + "px" }}
      >
        <div class={styles.item} onClick={() => exec("INSERT_NODE")}>
          插入同级节点
          <span class="desc">Enter</span>
        </div>
        <div class={styles.item} onClick={addNodeNote}>
          备注
          <span class="desc">Ctrl + R</span>
        </div>
      </div>
    );
  },
});
