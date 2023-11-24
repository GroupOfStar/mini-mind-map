import { defineComponent, onMounted, ref } from "vue";
import { getBbox } from "@mini-mind-map/mind-core";

export default defineComponent(function Bbox() {
  const mindMapRef = ref();

  onMounted(() => {
    getBbox(mindMapRef.value);
  });

  return () => <div class="mindMapContainer" ref={mindMapRef}></div>;
});
