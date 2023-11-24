import { SVG, G, Rect, Text } from "@svgdotjs/svg.js";

export const getBbox = (el: HTMLElement) => {
  // 1. text节点创建后,无需要挂载就可以获取宽高
  const textNode1 = new Text().text("测试节点1");
  console.log("textNode1.bbox() :>> ", textNode1.bbox());

  // 2.把创建的text节点放在rect节点下,获取的rect宽高是0
  const textNode2 = new Text().text("测试节点2");
  const rectNode2 = new Rect();
  textNode2.addTo(rectNode2);
  console.log("rectNode2.bbox() :>> ", rectNode2.bbox());

  // 3.把创建的text节点放在group组下,无需要挂载也可以获取group的宽高
  const textNode3 = new Text().text("测试节点3");
  const group3 = new G();
  textNode3.addTo(group3);
  console.log("group3.bbox() :>> ", group3.bbox());

  // 4.把创建的text和rect节点都放在group组下,无需要挂载group的宽高会跟text宽高一致
  const group4 = new G();
  const textNode4 = new Text().text("测试节点4");
  const rectNode4 = new Rect();
  rectNode4.addTo(group4);
  textNode4.addTo(group4);
  console.log("textNode4.bbox() :>> ", textNode4.bbox());
  console.log("group4.bbox() :>> ", group4.bbox());

  // 5.把创建的text和rect节点都放在group组下,设置rect大小后,group的宽高也会变成最大元素的尺寸
  const group5 = new G();
  const textNode5 = new Text().text("测试节点5");
  const rectNode5 = new Rect();
  rectNode5.addTo(group5);
  textNode5.addTo(group5);
  const text5bbox = textNode5.bbox();
  rectNode5.size(text5bbox.width + 100, text5bbox.height + 100);
  console.log("textNode5.bbox() :>> ", text5bbox);
  console.log("rectNode5.bbox() :>> ", rectNode5.bbox());
  console.log("group5.bbox() :>> ", group5.bbox());

  // 6.把创建的text和rect节点都放在group组下,设置rect大小后,再设置rect的padding,group的宽高也会变成最大元素的尺寸
  const group6 = new G();
  const textNode6 = new Text().text("测试节点5");
  const rectNode6 = new Rect().fill({ color: "#f06", opacity: 0.5 });
  rectNode6.addTo(group6);
  textNode6.addTo(group6);
  const text6bbox = textNode6.bbox();
  rectNode6.size(text6bbox.width + 100, text6bbox.height + 100);
  //   rectNode6.css("padding", "12");
  console.log("textNode6.bbox() :>> ", text6bbox);
  console.log("rectNode6.bbox() :>> ", rectNode6.bbox());
  console.log("group6.bbox() :>> ", group6.bbox());

  const draw = SVG().size("100%", "100%");
  draw.addTo(el);
  draw.move(100, 100);
  group6.addTo(draw);

  //   const rectNode = new Rect();
  //   rectNode.addTo(group);

  //   const textNode = new Text().text("测试节点");
  //   //   rectNode.add(textNode);
  //   textNode.addTo(group);
  //   console.log("textNode :>> ", textNode.bbox());

  //   console.log("rectNode :>> ", rectNode.bbox());
};
