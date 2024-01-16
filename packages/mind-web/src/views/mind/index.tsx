import { onMounted, onBeforeUnmount, ref, defineComponent, reactive } from "vue";
import Sidebar from "./../../components/Sidebar/index.vue";
import { ContextMenu, NodeNote } from "./components/Plugin";
import { Graph, debounce } from "@mini-mind-map/mind-core";
import { config, nodeList } from "../../data";

export default defineComponent(function Node() {
  const mindMapRef = ref<HTMLDivElement | null>();
  const contextMenuVisible = ref(false);
  const nodeNoteVisible = ref(false);
  const position = reactive({ x: 0, y: 0 });
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

    mindMap.on("graph_contextmenu", (e) => {
      e.stopPropagation();
      contextMenuVisible.value = false;
      nodeNoteVisible.value = false;
    });

    mindMap.on("graph_click", () => {
      contextMenuVisible.value = false;
      nodeNoteVisible.value = false;
    });

    mindMap.on("node_contextmenu", (node) => {
      const graphPosition = mindMap.position;
      const { translateX = 0, translateY = 0 } = mindMap.graphGroup.transform();
      position.x = node.shape.x + graphPosition.x + translateX;
      position.y = node.shape.y + node.shape.selectedNodeHeight + graphPosition.y + translateY;
      contextMenuVisible.value = true;
      nodeNoteVisible.value = false;
    });

    window.addEventListener("resize", onResize);
  });

  onBeforeUnmount(() => {
    if (mindMapRef.value) {
      mindMap.unbindEvent();
    }
    window.removeEventListener("resize", onResize);
  });

  return () => {
    const nodeNoteProps = {
      mindMap,
      nodeNoteVisible,
      ...position,
    };
    const contextMenuProps = { ...nodeNoteProps, contextMenuVisible };
    return (
      <div class="mindMapContainer" ref={mindMapRef}>
        <Sidebar mindMap={mindMap} />
        <ContextMenu {...contextMenuProps} />
        <NodeNote {...nodeNoteProps} />
      </div>
    );
  };
});
