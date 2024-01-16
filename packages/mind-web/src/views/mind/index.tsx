import { onMounted, onBeforeUnmount, ref, defineComponent, reactive, nextTick } from "vue";
import Sidebar from "./../../components/Sidebar/index.vue";
import { ContextMenu, NodeNote } from "./components/Plugin";
import type { IMenuType, IContextMenuExpose, INodeNoteExpose } from "./components/Plugin";
import { Graph, debounce } from "@mini-mind-map/mind-core";
import { config, nodeList } from "../../data";
import { showModalByPosition } from "../../utils";

export default defineComponent(function Node() {
  const mindMapRef = ref<HTMLDivElement | null>();
  const contextMenuVisible = ref(false);
  const contextMenuRef = ref<IContextMenuExpose>();
  const nodeNoteVisible = ref(false);
  const nodeNoteRef = ref<INodeNoteExpose>();
  const position = reactive({ x: 0, y: 0 });
  const mindMap = new Graph();

  const onResize = debounce(mindMap.onResize.bind(mindMap));

  // 隐藏弹出层
  const hideModal = () => {
    contextMenuVisible.value = false;
    nodeNoteVisible.value = false;
  };

  // 选择菜单
  const onContextMenuSelected = (type: IMenuType, event: MouseEvent) => {
    contextMenuVisible.value = false;
    switch (type) {
      case "INSERT_NODE":
        console.log("INSERT_NODE");
        break;
      case "NOTE":
        const noteRef = nodeNoteRef.value;
        if (noteRef) {
          nodeNoteVisible.value = true;
          nextTick(() => {
            const { x, y } = showModalByPosition(noteRef.ref, event as MouseEvent);
            position.x = x;
            position.y = y;
          });
        }
        break;
    }
  };

  onMounted(() => {
    const { id: rootId } = config;
    if (mindMapRef.value) {
      mindMap.setContainer(mindMapRef.value);
      mindMap.setDataByList(nodeList, rootId);
      mindMap.render();

      mindMap.layout();
      mindMap.onResize();
    }

    mindMap.on("graph_contextmenu", hideModal);
    mindMap.on("graph_click", hideModal);
    mindMap.on("node_click", hideModal);

    mindMap.on("node_contextmenu", ({ event }) => {
      const menuRef = contextMenuRef.value;
      if (menuRef) {
        contextMenuVisible.value = true;
        nodeNoteVisible.value = false;
        nextTick(() => {
          const { x, y } = showModalByPosition(menuRef.ref, event as MouseEvent);
          position.x = x;
          position.y = y;
        });
      }
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
    const contextMenuProps = { mindMap, contextMenuVisible, position };
    const nodeNoteProps = { mindMap, nodeNoteVisible, position };
    return (
      <div class="mindMapContainer" ref={mindMapRef}>
        <Sidebar mindMap={mindMap} />
        <ContextMenu
          ref={contextMenuRef}
          {...contextMenuProps}
          onContextMenuSelected={onContextMenuSelected}
        />
        <NodeNote ref={nodeNoteRef} {...nodeNoteProps} />
      </div>
    );
  };
});
