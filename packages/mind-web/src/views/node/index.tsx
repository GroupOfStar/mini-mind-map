import { defineComponent, onMounted, ref } from "vue";
import { borderNode } from "@mini-mind-map/mind-core";

export default defineComponent(function Node() {
  const mindMapRef = ref();

  onMounted(() => {
    borderNode(mindMapRef.value);
  });

  return () => <div class="mindMapContainer" ref={mindMapRef}></div>;
});
