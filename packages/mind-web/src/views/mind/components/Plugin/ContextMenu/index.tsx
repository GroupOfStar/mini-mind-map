import { defineComponent, ref } from "vue";
import { ContextMenuPropsDefine, IMenuType } from "./interface.d";
import styles from "./index.module.less";

/** 右键菜单组件 */
export const ContextMenu = defineComponent({
  name: "ContextMenu",
  props: ContextMenuPropsDefine,
  emits: ["contextMenuSelected"],
  setup(props, { emit, expose }) {
    const { contextMenuVisible, position } = props;
    const contextMenuModalRef = ref<HTMLElement>();
    expose({ ref: contextMenuModalRef });

    // 选择菜单
    const onMenuSelected = (type: IMenuType, event: MouseEvent) => {
      emit("contextMenuSelected", type, event);
    };
    return () => (
      <div
        v-show={contextMenuVisible.value}
        ref={contextMenuModalRef}
        class={styles.contextMenuContainer}
        style={{ left: position.x + "px", top: position.y + "px" }}
      >
        <div class={styles.item} onClick={(event) => onMenuSelected("INSERT_NODE", event)}>
          插入同级节点
          <span class="desc">Enter</span>
        </div>
        <div class={styles.item} onClick={(event) => onMenuSelected("NOTE", event)}>
          备注
          <span class="desc">Ctrl + R</span>
        </div>
      </div>
    );
  },
});
