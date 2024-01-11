import { defineComponent, onMounted, reactive, ref } from "vue";
import { borderNode } from "@mini-mind-map/mind-core";
import styles from "./index.module.less";

export default defineComponent(function Contextmenu() {
  const mindMapRef = ref();
  const position = reactive({ left: 0, top: 0 });

  onMounted(() => {
    borderNode(mindMapRef.value);
  });
  const exec = (type: "INSERT_NODE") => {
    console.log("type :>> ", type);
  };
  return () => (
    <div
      class={styles.contextMenuContainer}
      style={{ left: position.left + "px", top: position.top + "px" }}
    >
      <div class={styles.item} onClick={() => exec("INSERT_NODE")}>
        插入同级节点
        <span class="desc">Enter</span>
      </div>
      <div class={styles.item} onClick={() => exec("INSERT_NODE")}>
        备注
        <span class="desc">Ctrl + R</span>
      </div>
    </div>
  );
});
