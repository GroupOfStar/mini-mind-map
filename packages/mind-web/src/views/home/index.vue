<template>
  <div class="mindMapContainer" ref="mindMapRef"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import { Graph, Utils, RootNode, RightLogical, drawEdge } from "@mini-mind-map/mind-core";
import { config, nodeList } from "../../data";

const mindMapRef = ref<HTMLDivElement | null>();
const mindMap = new Graph();

const onResize = Utils.debounce(mindMap.onResize.bind(mindMap));

onMounted(() => {
  const { id: rootId } = config;
  if (mindMapRef.value) {
    mindMap.setContainer(mindMapRef.value);
    console.log("nodeList :>> ", nodeList);
    mindMap.setDataByList(nodeList, rootId);
    mindMap.render();

    const rootNode = mindMap.rootNode as RootNode;
    const layout = new RightLogical(rootNode);
    layout.doLayout();
    rootNode.eachNode((node) => {
      node.children.forEach((child, index) => {
        drawEdge(mindMap, child, index, node);
      });
      node.transform({
        rotate: 0,
        translateX: node.shape.x,
        translateY: node.shape.y,
        scale: 1,
      });
    });
    console.log("rootNode :>> ", rootNode);

    mindMap.onResize();
  }

  window.addEventListener("resize", onResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize);
});
</script>

<style scoped lang="less">
.mindMapContainer {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
