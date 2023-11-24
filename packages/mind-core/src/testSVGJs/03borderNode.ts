import { SVG, G, Rect, Text } from "@svgdotjs/svg.js";

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

function createNode(nodeContanier: G) {
  const group = new G().addTo(nodeContanier);
  const textNode = new Text()
    .text("测试节点")
    .fill({ color: "#fff" })
    .css("cursor", "pointer");
  const { width, height } = textNode.bbox();

  // padding: [8, 8]
  const borderNode = new Rect()
    .addTo(group)
    .addClass("node-border")
    .attr({
      width: width + 26 + 8,
      height: height + 16 + 8
    })
    .css("cursor", "pointer")
    //   .size(width + 26 + 8, height + 16 + 8)
    .fill({ opacity: 0 }) // 默认填充的是黑色,所以要设置成完全透明
    // .stroke({ width: 1 })
    .radius(4)
    .cx(0)
    .cy(0);

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
    nodeContanier.find("rect.active").forEach(item => {
      item.stroke({ width: 1, color: "transparent" });
      item.removeClass("active");
    });
    // 再给当前的节点加上active样式
    borderNode.addClass("active");
    borderNode.stroke({ width: 1, color: "#7716d9" });
  });

  // padding: [16, 26]
  new Rect()
    .addTo(group)
    .size(width + 26, height + 16)
    .css("cursor", "pointer")
    .radius(4)
    .fill({ color: "#ffabaa", opacity: 0.5 })
    .cx(0)
    .cy(0);

  // 一定要最后设置cx和cy,否则会错乱
  textNode.addTo(group).cx(0).cy(0);
  return group;
}

// 给所有节点注册事件
// const addEventListener = (groupList: G[]) => {
//   groupList.forEach(node => {});
// };

export const borderNode = (el: HTMLElement) => {
  const nodeContanier = initDraw(el);

  const group0 = createNode(nodeContanier);
  const group1 = createNode(nodeContanier);
  group1.transform({
    rotate: 0,
    translateX: 100,
    translateY: 100,
    scale: 1
  });

  const group2 = createNode(nodeContanier);
  group2.transform({
    rotate: 0,
    translateX: -100,
    translateY: -100,
    scale: 1
  });

  (nodeContanier.parent() as G)
    .cx(window.innerWidth / 2)
    .cy(window.innerHeight / 2);
};
