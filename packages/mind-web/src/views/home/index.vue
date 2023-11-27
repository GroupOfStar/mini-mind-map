<template>
    <div class="mindMapContainer" ref="mindMapRef"></div>
</template>
  
<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { Graph, INodeData, Utils } from '@mini-mind-map/mind-core'
import { mindMapData } from './mindMapData'

const mindMapRef = ref<HTMLDivElement | null>()
const mindMap = new Graph()

const onResize = Utils.debounce(mindMap.onResize.bind(mindMap))

onMounted(() => {
    const config = mindMapData[0]
    const { id: rootId } = config
    if (mindMapRef.value) {
        mindMap.setContainer(mindMapRef.value)
        console.log('mindMapData.slice(1) :>> ', mindMapData.slice(1));
        mindMap.setDataByList(mindMapData.slice(1) as INodeData[], rootId)
        mindMap.render()
        mindMap.onResize()
    }

    window.addEventListener("resize", onResize)
    console.log('mindMap :>> ', mindMap);
})

onBeforeUnmount(() => {
    window.removeEventListener("resize", onResize)
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