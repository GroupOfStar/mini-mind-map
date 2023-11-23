<template>
    <aside>
        <form @change="render" @submit.prevent.stop>
            <input type="number" min="2" v-model="dataSize">
            <select v-model="layoutType">
                <option v-for="item in layoutTypeOption" :key="item.value" :value="item.value">{{ item.title }}</option>
            </select>
        </form>
        <table>
            <thead>
                <tr>
                    <th>layout time(ms)</th>
                    <th>render time(ms)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td ref="layoutTimeRef">{{ layoutTime }}</td>
                    <td ref="renderTimeRef">{{ renderTime }}</td>
                </tr>
            </tbody>
        </table>
    </aside>

    <div class="container" ref="containerRef">
        <canvas id="canvas" ref="canvasRef"></canvas>
    </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref, reactive, onBeforeUnmount } from 'vue';
import * as MindmapLayouts from './../../../lib/mindMapLayouts'
import randomTree from './utils/randomTree'
import drawLink from './utils/drawLine'
import drawNode from './utils/drawNode'
import { debounce } from '../../utils';

const containerRef = ref<HTMLDivElement | null>()
const canvasRef = ref<HTMLCanvasElement | null>()

const dataSize = ref(30)
const layoutType = ref<'Standard' | 'DownwardOrganizational' | 'UpwardOrganizational' | 'LeftLogical'>("Standard")
const layoutTypeOption = reactive([
    { title: 'Standard', value: "Standard" },
    { title: 'Right Logical', value: "RightLogical" },
    { title: 'Downward Organizational', value: "DownwardOrganizational" },
    { title: 'Upward Organizational', value: "UpwardOrganizational" },
    { title: 'Left Logical', value: "LeftLogical" },
])

const layoutTime = ref(0)
const renderTime = ref(0)

const PEM = 18

const HORIZONTAL_LAYOUTS = [
    'LeftLogical',
    'RightLogical',
    'Standard'
]
function isHorizontal(type: string) {
    return HORIZONTAL_LAYOUTS.indexOf(type) > -1
}

function setCanvasSize() {
    const canvas = canvasRef.value
    const containerNode = containerRef.value
    if (canvas && containerNode) {
        canvas.width = containerNode.offsetWidth
        canvas.height = containerNode.offsetHeight
    }
}

function render() {
    console.log('render')
    const canvas = canvasRef.value
    const containerNode = containerRef.value

    const ctx = canvas?.getContext('2d')

    if (canvas && ctx && containerNode) {

        const root = randomTree(dataSize.value)
        Object.assign(root, {
            isRoot: true
        })

        ctx.font = `${PEM}px Courier, monospace`

        const MindmapLayout = MindmapLayouts[layoutType.value]
        const layout = new MindmapLayout(root, {
            getHeight(d: any) {
                if (d.isRoot) {
                    return PEM * 2.4
                }
                return PEM * 1.2
            },
            getWidth(d: any) {
                if (d.isRoot) {
                    return ctx.measureText(d.name).width * 2 + PEM * 1.6
                }
                return ctx.measureText(d.name).width + PEM * 1.6
            },
            getHGap(d: any) {
                if (d.isRoot) {
                    return PEM * 2
                }
                return Math.round(PEM / 2)
            },
            getVGap(d: any) {
                if (d.isRoot) {
                    return PEM * 2
                }
                return Math.round(PEM / 2)
            }
        })

        const t0 = window.performance.now()

        const rootNode = layout.doLayout()

        const t1 = window.performance.now()

        setCanvasSize()
        const bb = rootNode.getBoundingBox()
        const scale = Math.max(bb.width / canvas.width, bb.height / canvas.height)
        canvas.width = bb.width / scale
        canvas.height = bb.height / scale

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        rootNode.eachNode((node: any) => {
            node.children.forEach((child: any) => {
                drawLink(node, child, ctx, isHorizontal(layoutType.value), scale)
            })
            drawNode(node, ctx, scale)
        })
        const t2 = window.performance.now()
        layoutTime.value = Math.round(t1 - t0)
        renderTime.value = Math.round(t2 - t1)
    }
}

const onResize = debounce(() => {
    console.log('onResize')
    setCanvasSize()
    render()
})

onMounted(() => {
    setCanvasSize()
    render()
    window.addEventListener("resize", onResize)
})

onBeforeUnmount(() => {
    window.removeEventListener("resize", onResize)
})
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    overflow: hidden;
}

html,
body {
    width: 100%;
    height: 100%;
}

aside {
    position: absolute;
    right: 2px;
    bottom: 2px;
    padding: .5em;
    border: 1px solid gray;
    background-color: white;
    opacity: 0.5;
}

aside:hover {
    opacity: 0.9;
}

form {
    margin-bottom: .5em;
}

table,
table thead {
    width: 100%;
    border: 1px solid #cbcbcb;
    empty-cells: show;
    border-collapse: collapse;
    border-spacing: 0;
}

table td,
table th {
    border-left: 1px solid #cbcbcb;
}

table td {
    text-align: right;
}

.container {
    text-align: center;
    height: 100vh;
    width: 100%;
}

canvas {
    max-width: 100%;
    max-height: 100%;
}
</style>./utils/randomTree./utils/drawNode./utils/drawLine