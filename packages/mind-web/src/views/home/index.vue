<template>
  <div class="mindMapContainer" ref="mindMapRef"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import { Graph, layout, Utils, RootNode } from "@mini-mind-map/mind-core";
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
    console.log("object");
    layout(rootNode);
    console.log("mindMap.rootNode :>> ", rootNode);
    // rootNode.transform({
    //   rotate: 0,
    //   translateX: -200,
    //   translateY: -100,
    //   scale: 1.2
    // });

    mindMap.onResize();
  }

  window.addEventListener("resize", onResize);
  console.log("mindMap :>> ", mindMap);
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
