<template>
  <div class="mindMapContainer" ref="mindMapRef">
    <Sidebar :mindMap="mindMap" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import Sidebar from "./../../components/Sidebar/index.vue";
import { Graph, debounce } from "@mini-mind-map/mind-core";
import { config, nodeList } from "../../data";

const mindMapRef = ref<HTMLDivElement | null>();
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
