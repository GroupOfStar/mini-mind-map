<template>
  <div class="mindMapContainer" ref="mindMapRef"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { craeteSVGDom } from '@mini-mind-map/mind-core'

const mindMapRef = ref()
const svgDom = craeteSVGDom()

onMounted(() => {
  // svgDom.addTo(mindMapRef.value)
  const { draw, rectNode, textNode } = svgDom
  draw.addTo(mindMapRef.value)
  const rectBox = rectNode.node.getBoundingClientRect();
  const textBox = textNode.node.getBoundingClientRect();
  console.log('rectBox :>> ', rectBox);
  console.log('textBox :>> ', textBox);
})
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