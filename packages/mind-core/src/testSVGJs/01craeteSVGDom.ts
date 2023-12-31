import { SVG, G, Rect, Text } from "@svgdotjs/svg.js";

export const craeteSVGDom = () => {
  const draw = SVG().size("100%", "100%");
  const group = draw.group();
  console.log("group :>> ", group);
  group.path("M10, 20L30, 40");
  const rectNode = new Rect()
    .size(100, 100)
    .fill({ color: "#f06", opacity: 0.5 });
  const rectBox = rectNode.node.getBoundingClientRect();
  const textNode = new Text().text("测试节点");
  const textBox = textNode.node.getBoundingClientRect();
  const x = (rectBox.width - textBox.width) / 2;
  const y = (rectBox.height - textBox.height) / 2;
  textNode.x(x).y(y);
  textNode.attr({ fill: "#fff" });
  group.add(rectNode);
  group.add(textNode);

  draw.add(group);
  return { draw, group, rectNode, textNode };
};
