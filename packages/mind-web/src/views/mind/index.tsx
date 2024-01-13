import { onMounted, onBeforeUnmount, ref, defineComponent } from "vue";
import Sidebar from "./../../components/Sidebar/index.vue";
import ContextMenu from "./components/Plugin/ContextMenu";
import { Graph, debounce } from "@mini-mind-map/mind-core";
import { config, nodeList } from "../../data";

export default defineComponent(function Node() {
  const mindMapRef = ref<HTMLDivElement | null>();
  const isShow = ref(false);
  const mindMap = new Graph();

  const onResize = debounce(mindMap.onResize.bind(mindMap));

  onMounted(() => {
    const { id: rootId } = config;
    if (mindMapRef.value) {
      mindMap.setContainer(mindMapRef.value);
      mindMap.setDataByList(nodeList, rootId);
      mindMap.render();
      console.log("mindMap :>> ", mindMap);

      mindMap.layout();
      mindMap.onResize();
    }

    window.addEventListener("resize", onResize);
  });

  onBeforeUnmount(() => {
    if (mindMapRef.value) {
      mindMap.unbindEvent();
    }
    window.removeEventListener("resize", onResize);
  });

  return () => (
    <div class="mindMapContainer" ref={mindMapRef}>
      <Sidebar mindMap={mindMap} />
      {isShow.value && <ContextMenu />}
    </div>
  );
});
