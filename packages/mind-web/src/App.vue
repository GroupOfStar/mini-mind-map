<template>
  <div class="mindMapContainer" ref="mindMapRef"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { GraphMindMap, IMindDataItem } from '@mini-mind-map/mind-core'
import { mindMapData } from './mindMapData'

const mindMapRef = ref()

onMounted(() => {
  const mindMap = new GraphMindMap({ container: mindMapRef.value })

  const config = mindMapData[0]

  console.log('config :>> ', config);

  const { id: rootId } = config
  const rootNode = mindMapData[1]
  if (rootNode) {
    const mapData = mindMapData.slice(1).map<IMindDataItem>(item => ({ id: item.id, pid: item.pid || '', type: item.pid === rootId ? "rootNode" : (item.pid === rootNode.id ? "secondNode" : "defaultNode"), text: item.text }))
    mindMap.data([mapData[0]])
    mindMap.render()
  }

  console.log('mindMap :>> ', mindMap);
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