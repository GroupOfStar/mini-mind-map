import { Style } from "./Style";

/** 蓝色系 */
export const blueGray = Style.mergeTheme({
  // 连线的颜色
  lineColor: "#4A51D9",
  // 连线风格
  lineStyle: "straight",
  // 概要连线的颜色
  generalizationLineColor: "#4A51D9",
  // 背景颜色
  backgroundColor: "#FFFFFF",
  // 根节点样式
  root: {
    fillColor: "#4A51D9",
    // 连线的颜色
    lineColor: "#4A51D9"
  },
  // 二级节点样式
  second: {
    fillColor: "#6CA1FF",
    color: "#FFFFFF",
    // 连线的粗细
    lineWidth: 2,
    // 连线的颜色
    lineColor: "#4A51D9",
    // 连线样式
    borderWidth: 0
  },
  // 三级及以下节点样式
  node: {
    // 连线的颜色
    lineColor: "#4A51D9",
    fillColor: "#EBEBEB",
    color: "#0D0D0D",
    borderColor: "#8BB5FF"
  },
  // 概要节点样式
  generalization: {
    fillColor: "#4A51D9",
    color: "#fff",
    borderColor: "#549688"
  }
});
