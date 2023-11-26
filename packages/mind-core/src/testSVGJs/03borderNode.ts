import { SVG, G, Rect, Text } from "@svgdotjs/svg.js";
import { Style } from "../style";
import type { INodeType } from "./../style";

const initDraw = (el: HTMLElement) => {
  const draw = SVG().size("100%", "100%");
  draw.node.style.backgroundColor = "rgb(242, 242, 242)";
  draw.addTo(el);

  const graphGroup = draw.group().addClass("g-graph");
  const group = new G({ class: "g-nodes" });
  group.addTo(graphGroup);

  // 取消所有节点的active样式状态
  draw.on("click", () => {
    draw.find("rect.active").forEach(item => {
      item.stroke({ width: 1, color: "transparent" });
      item.removeClass("active");
    });
  });

  return group;
};

function createNode(nodesGroup: G, nodeType: INodeType = "node") {
  const group = new G().addTo(nodesGroup);

  // 文本节点
  const textNode = new Text().addClass("text").text("测试节点");
  // 节点边框
  new Rect().addTo(group).addClass("node-border");
  // 节点本身
  new Rect().addTo(group).addClass("node");

  // 确保text节点在最后一个, 所以最后添加
  textNode.addTo(group);
  const style = new Style(nodeType);
  console.log("style :>> ", style);
  style.setNodeStyleByType(group);

  // 一定要最后设置cx和cy,否则会错乱
  textNode.cx(0).cy(0);
  return group;
}

/**
 * 给所有节点注册事件
 * @param nodesGroup 节点G组
 */
const addEventListener = (nodesGroup: G) => {
  nodesGroup.children().forEach(group => {
    const borderNode = group.findOne("rect.node-border") as Rect | null;
    if (borderNode) {
      group.on("mouseover", event => {
        event.stopPropagation();
        if (!borderNode.hasClass("active")) {
          borderNode.stroke({ width: 1, color: "#caa2ff" });
        }
      });

      group.on("mouseout", event => {
        event.stopPropagation();
        if (!borderNode.hasClass("active")) {
          borderNode.stroke({ width: 1, color: "transparent" });
        }
      });

      group.on("click", event => {
        event.stopPropagation();
        // 先取消容器组下所有的active样式
        nodesGroup.find("rect.active").forEach(item => {
          item.stroke({ width: 1, color: "transparent" });
          item.removeClass("active");
        });
        // 再给当前的节点加上active样式
        borderNode.addClass("active");
        borderNode.stroke({ width: 1, color: "#7716d9" });
      });
    }
  });
};

export const borderNode = (el: HTMLElement) => {
  debugger;
  const nodesGroup = initDraw(el);

  const group0 = createNode(nodesGroup, "root");
  const group1 = createNode(nodesGroup, "second");
  group1.transform({
    rotate: 0,
    translateX: 100,
    translateY: 100,
    scale: 1
  });

  const group2 = createNode(nodesGroup, "node");
  group2.transform({
    rotate: 0,
    translateX: -100,
    translateY: -100,
    scale: 1
  });

  addEventListener(nodesGroup);

  (nodesGroup.parent() as G)
    .cx(window.innerWidth / 2)
    .cy(window.innerHeight / 2);
};
