import { Theme } from "./Theme";

/** 商务 */
export const deepPurple = Theme.mergeTheme({
  // 连线的颜色
  lineColor: "#534E96",
  // 概要连线的颜色
  generalizationLineColor: "#5E3295",
  // 背景颜色
  backgroundColor: "#FFFFFF",
  // 根节点样式
  root: {
    // 连线的颜色
    lineColor: "#534E96",
    fillColor: "#5E3295",
  },
  // 二级节点样式
  second: {
    // 连线的颜色
    lineColor: "#534E96",
    fillColor: "#534E96",
    borderWidth: 1,
    color: "#FFFFFF",
  },
  // 三级及以下节点样式
  node: {
    // 连线的颜色
    lineColor: "#534E96",
    fillColor: "#DDDCEA",
    color: "#534E96",
    borderWidth: 1,
  },
  // 概要节点样式
  generalization: {
    fillColor: "#5E3295",
    borderColor: "rgb(56, 123, 233)",
    color: "#fff",
    borderWidth: 0,
  },
});
