import { defineComponent, onMounted, ref } from "vue";
import { craeteSVGDom } from "@mini-mind-map/mind-core";

export default defineComponent(function Svgjs() {
  const mindMapRef = ref();

  onMounted(() => {
    console.log("mindMapRef.value :>> ", mindMapRef.value);
    // svgDom.addTo(mindMapRef.value)
    const { draw, rectNode, textNode } = craeteSVGDom();
    draw.addTo(mindMapRef.value);
    const rectBox = rectNode.node.getBoundingClientRect();
    const textBox = textNode.node.getBoundingClientRect();
    console.log("rectBox :>> ", rectBox);
    console.log("textBox :>> ", textBox);
  });

  return () => <div class="mindMapContainer" ref={mindMapRef}></div>;
});
