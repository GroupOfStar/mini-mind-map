<template>
    <div class="mindMapContainer" ref="mindMapRef"></div>
</template>
  
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { Graph, IGraphDataItem, Utils } from '@mini-mind-map/mind-core'
import { mindMapData } from './mindMapData'

const mindMapRef = ref<HTMLDivElement | null>()
const mindMap = new Graph()

const onResize = Utils.debounce(mindMap.onResize.bind(mindMap))

onMounted(() => {
    const config = mindMapData[0]

    const { id: rootId } = config
    const rootNode = mindMapData[1]
    if (rootNode && mindMapRef.value) {
        mindMap.setContainer(mindMapRef.value)
        const mapData = mindMapData.slice(1).map<IGraphDataItem>(item => ({ id: item.id, pid: item.pid || '', type: item.pid === rootId ? "rootNode" : (item.pid === rootNode.id ? "secondNode" : "defaultNode"), text: item.text }))
        mindMap.setDataList(mapData)
        mindMap.render()
        mindMap.onResize()
    }

    window.addEventListener("resize", onResize)
    console.log('mindMap :>> ', mindMap);
})

onUnmounted(() => {
    window.removeEventListener('resize', onResize)
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