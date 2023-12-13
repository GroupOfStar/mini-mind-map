import { Graph } from "src/graph";
import { Node } from "src/node";

// 二次贝塞尔曲线
function quadraticCurvePath(x1: number, y1: number, x2: number, y2: number) {
  const cx = x1 + (x2 - x1) * 0.2;
  const cy = y1 + (y2 - y1) * 0.8;
  return `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`;
}

// 三次贝塞尔曲线
function cubicBezierPath(x1: number, y1: number, x2: number, y2: number) {
  const cx1 = x1 + (x2 - x1) / 2;
  const cy1 = y1;
  const cx2 = cx1;
  const cy2 = y2;
  return `M ${x1},${y1} C ${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`;
}

// 画线
export const drawEdge = function (mindMap: Graph, current: Node, index: number, parentNode?: Node) {
  if (parentNode) {
    let x1 = 0;
    let y1 = parentNode.shape.y;
    const x2 = current.shape.x - current.shape.width / 2;
    const y2 = current.shape.y;
    let path = "";
    // 根节点连二级节点
    if (current.depth === 1) {
      x1 = parentNode.shape.x;
      path = quadraticCurvePath(x1, y1, x2, y2);
    } else {
      x1 = parentNode.shape.x + parentNode.shape.width / 2;
      path = cubicBezierPath(x1, y1, x2, y2);
    }
    const line = mindMap.linesGroup.path(path);
    line.fill("none");
    const { lineColor, lineWidth } = mindMap.canvas;
    line.stroke({ color: lineColor, width: lineWidth });
  }
};
