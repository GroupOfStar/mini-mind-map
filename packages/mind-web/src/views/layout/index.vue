<template>
    <aside>
        <form id="layout-props" ref="layoutPropsRef">
            <input name="dataSize" type="number" min="1" value="20">
            <select name="layoutType">
                <option value="Standard">Standard</option>
                <option value="RightLogical">Right Logical</option>
                <option value="DownwardOrganizational">Downward Organizational</option>
                <option value="UpwardOrganizational">Upward Organizational</option>
                <option value="LeftLogical">Left Logical</option>
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
                    <td ref="layoutTimeRef">0</td>
                    <td ref="renderTimeRef">0</td>
                </tr>
            </tbody>
        </table>
    </aside>

    <div class="container" ref="containerRef">
        <canvas id="canvas" ref="canvasRef"></canvas>
    </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import MindmapLayouts from 'mindmap-layouts'
import randomTree from './utils/randomTree'
import drawLink from './utils/drawLine'
import drawNode from './utils/drawNode'

const layoutPropsRef = ref<HTMLFormElement | null>()
const layoutTimeRef = ref<HTMLDivElement | null>()
const renderTimeRef = ref<HTMLDivElement | null>()
const containerRef = ref<HTMLDivElement | null>()
const canvasRef = ref<HTMLCanvasElement | null>()

const PEM = 18

const HORIZONTAL_LAYOUTS = [
    'LeftLogical',
    'RightLogical',
    'Standard'
]
function isHorizontal(type: string) {
    return HORIZONTAL_LAYOUTS.indexOf(type) > -1
}

onMounted(() => {
    const canvas = canvasRef.value
    const containerNode = containerRef.value
    const formNode = layoutPropsRef.value
    const layoutTimeNode = layoutTimeRef.value
    const renderTimeNode = renderTimeRef.value

    const ctx = canvas?.getContext('2d')

    function setCanvasSize() {
        if (canvas && containerNode) {
            console.log('canvas :>> ', canvas);
            console.log('containerNode :>> ', containerNode);
            canvas.width = containerNode.offsetWidth
            canvas.height = containerNode.offsetHeight
        }
    }

    function render() {
        if (canvas && ctx && containerNode && formNode && layoutTimeNode && renderTimeNode) {
            console.log("render")
            const count = formNode.dataSize.value
            const layoutType = formNode.layoutType.value
            const root = randomTree(count)
            console.log('root :>> ', root);
            Object.assign(root, {
                isRoot: true
            })

            ctx.font = `${PEM}px Courier, monospace`

            const MindmapLayout = MindmapLayouts[layoutType]
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

            console.log('rootNode :>> ', rootNode);

            const t1 = window.performance.now()

            setCanvasSize()
            const bb = rootNode.getBoundingBox()
            console.log('bb :>> ', bb);
            console.log('canvas.width :>> ', canvas.width);
            console.log('canvas.height :>> ', canvas.height);
            const scale = Math.max(bb.width / canvas.width, bb.height / canvas.height)
            canvas.width = bb.width / scale
            canvas.height = bb.height / scale

            ctx.clearRect(0, 0, canvas.width, canvas.height)
            rootNode.eachNode((node: any) => {
                node.children.forEach((child: any) => {
                    drawLink(node, child, ctx, isHorizontal(layoutType), scale)
                })
                drawNode(node, ctx, scale)
            })
            const t2 = window.performance.now()
            layoutTimeNode.innerHTML = Math.round(t1 - t0).toString()
            renderTimeNode.innerHTML = Math.round(t2 - t1).toString()
        }
    }

    if (formNode) {
        formNode.addEventListener('change', render)
        formNode.addEventListener('submit', (e) => {
            e.preventDefault()
            render()
            return false
        })
    }
    window.onresize = () => {
        setCanvasSize()
        render()
    }
    setCanvasSize()
    render()
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