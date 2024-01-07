import { Graph } from "./../graph";
import { getEdgePoint } from "./getEdgePoint";

/**
 * 直线连接
 * @param x1 开始位置的x轴
 * @param y1 开始位置的y轴
 * @param x2 结束位置的x轴
 * @param y2 结束位置的y轴
 * @returns path路径
 */
export function straightLinePath(edgePoint: ReturnType<getEdgePoint>) {
  const { beginX, beginY, endX, endY } = edgePoint;
  return `M ${beginX},${beginY} Q ${endX},${endY}`;
}

/**
 * 二次贝塞尔曲线
 * @param x1 开始位置的x轴
 * @param y1 开始位置的y轴
 * @param x2 结束位置的x轴
 * @param y2 结束位置的y轴
 * @returns path路径
 */
export function quadraticCurvePath(edgePoint: ReturnType<getEdgePoint>) {
  const { beginX, beginY, endX, endY } = edgePoint;
  const cx = beginX + (endX - beginX) * 0.2;
  const cy = beginY + (endY - beginY) * 0.8;
  return `M ${beginX},${beginY} Q ${cx},${cy} ${endX},${endY}`;
}

/**
 * 三次贝塞尔曲线
 * @param x1 开始位置的x轴
 * @param y1 开始位置的y轴
 * @param x2 结束位置的x轴
 * @param y2 结束位置的y轴
 * @returns path路径
 */
export function cubicBezierPath(edgePoint: ReturnType<getEdgePoint>) {
  const { beginX, beginY, endX, endY } = edgePoint;
  const cx1 = beginX + (endX - beginX) / 2;
  const cy1 = beginY;
  const cx2 = cx1;
  const cy2 = endY;
  return `M ${beginX},${beginY} C ${cx1},${cy1} ${cx2},${cy2} ${endX},${endY}`;
}

// 画线
export const drawEdge = function (
  mindMap: Graph,
  path: string,
  edgePoint: ReturnType<getEdgePoint>
) {
  const { beginX, beginY, endX, endY } = edgePoint;

  const line = mindMap.linesGroup.path(path);
  line.on("click", (event) => {
    console.log("width :>> ", beginX - endX, "height :>> ", beginY - endY);
  });
  line.fill("none");
  const { lineColor, lineWidth } = mindMap.theme.config;
  line.stroke({ color: lineColor, width: lineWidth });
};
