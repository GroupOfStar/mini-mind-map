import {
  defineComponent,
  onMounted,
  ref,
  reactive,
  onBeforeUnmount,
  Fragment,
} from "vue";
import * as MindmapLayouts from "./../../../lib/mindMapLayouts";
import drawLink from "./utils/drawLine";
import drawNode from "./utils/drawNode";
import { nodeTree } from "../../data";
import { debounce } from "../../utils";
import styles from "./index.module.less";

export default defineComponent(function Layout() {
  const containerRef = ref<HTMLDivElement>();
  const canvasRef = ref<HTMLCanvasElement>();

  const dataSize = ref(30);
  const layoutType = ref<
    | "Standard"
    | "DownwardOrganizational"
    | "UpwardOrganizational"
    | "LeftLogical"
    | "RightLogical"
  >("RightLogical");

  const layoutTypeOption = reactive([
    { title: "Standard", value: "Standard" },
    { title: "Right Logical", value: "RightLogical" },
    { title: "Downward Organizational", value: "DownwardOrganizational" },
    { title: "Upward Organizational", value: "UpwardOrganizational" },
    { title: "Left Logical", value: "LeftLogical" },
  ]);

  const layoutTime = ref(0);
  const renderTime = ref(0);

  const PEM = 18;

  const HORIZONTAL_LAYOUTS = ["LeftLogical", "RightLogical", "Standard"];

  function isHorizontal(type: string) {
    return HORIZONTAL_LAYOUTS.indexOf(type) > -1;
  }

  function setCanvasSize() {
    const canvas = canvasRef.value;
    const containerNode = containerRef.value;
    if (canvas && containerNode) {
      canvas.width = containerNode.offsetWidth;
      canvas.height = containerNode.offsetHeight;
    }
  }

  function render() {
    console.log("render");
    const canvas = canvasRef.value;
    const containerNode = containerRef.value;

    const ctx = canvas?.getContext("2d");

    if (canvas && ctx && containerNode) {
      const root = nodeTree[0];
      // const root = randomTree(dataSize.value);
      Object.assign(root, {
        isRoot: true,
      });

      console.log("root :>> ", root);

      ctx.font = `${PEM}px Courier, monospace`;

      const MindmapLayout = MindmapLayouts[layoutType.value];
      const layout = new MindmapLayout(root, {
        getHeight(d) {
          if (d.isRoot) {
            return PEM * 2.4;
          }
          return PEM * 1.2;
        },
        getWidth(d) {
          if (d.isRoot) {
            return ctx.measureText(d.name).width * 2 + PEM * 1.6;
          }
          return ctx.measureText(d.name).width + PEM * 1.6;
        },
        getHGap(d) {
          if (d.isRoot) {
            return PEM * 2;
          }
          return Math.round(PEM / 2);
        },
        getVGap(d) {
          if (d.isRoot) {
            return PEM * 2;
          }
          return Math.round(PEM / 2);
        },
      });

      const t0 = window.performance.now();
      const rootNode = layout.doLayout();
      const t1 = window.performance.now();

      setCanvasSize();
      const bb = rootNode.getBoundingBox();
      const scale = Math.max(
        bb.width / canvas.width,
        bb.height / canvas.height
      );
      canvas.width = bb.width / scale;
      canvas.height = bb.height / scale;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rootNode.eachNode((node) => {
        node.children.forEach((child) => {
          drawLink(node, child, ctx, isHorizontal(layoutType.value), scale);
        });
        drawNode(node, ctx, scale);
      });
      const t2 = window.performance.now();
      layoutTime.value = Math.round(t1 - t0);
      renderTime.value = Math.round(t2 - t1);
    }
  }

  const onResize = debounce(() => {
    setCanvasSize();
    render();
  });

  const onSubmit = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  onMounted(() => {
    setCanvasSize();
    render();
    window.addEventListener("resize", onResize);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", onResize);
  });
  return () => (
    <Fragment>
      <aside>
        <form onChange={render} onSubmit={onSubmit}>
          <input type="number" min={2} v-model={dataSize.value} />
          <select v-model={layoutType.value}>
            {layoutTypeOption.map((item) => (
              <option key={item.value} value={item.value}>
                {item.title}
              </option>
            ))}
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
              <td>{layoutTime.value}</td>
              <td>{renderTime.value}</td>
            </tr>
          </tbody>
        </table>
      </aside>

      <div class={styles.container} ref={containerRef}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </Fragment>
  );
});
