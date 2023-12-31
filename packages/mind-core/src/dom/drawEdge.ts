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
export const drawEdge = function (
  mindMap: Graph,
  current: Node,
  index: number,
  parentNode: Node,
  isHorizontal: boolean
) {
  if (parentNode) {
    let beginNode: Node;
    let endNode: Node;
    let beginX: number;
    let beginY: number;
    let endX: number;
    let endY: number;
    // 水平节点布局
    if (isHorizontal) {
      if (current.shape.x > parentNode.shape.x) {
        beginNode = current;
        endNode = parentNode;
      } else {
        beginNode = parentNode;
        endNode = current;
      }
      beginX = beginNode.shape.x - beginNode.shape.width / 2;
      beginY = beginNode.shape.y;
      if (endNode.isRoot) {
        endX = endNode.shape.x;
      } else {
        endX = endNode.shape.x + endNode.shape.width / 2;
      }
      endY = endNode.shape.y;
    } else {
      if (current.shape.y > parentNode.shape.y) {
        beginNode = current;
        endNode = parentNode;
      } else {
        beginNode = parentNode;
        endNode = current;
      }
      beginX = beginNode.shape.x;
      beginY = beginNode.shape.y - beginNode.shape.height / 2;
      endX = endNode.shape.x;
      if (endNode.isRoot) {
        endY = endNode.shape.y;
      } else {
        endY = endNode.shape.y + endNode.shape.height / 2;
      }
    }

    let path = "";
    // 根节点连二级节点
    if (beginNode.depth === 1) {
      path = quadraticCurvePath(beginX, beginY, endX, endY);
    } else {
      path = cubicBezierPath(beginX, beginY, endX, endY);
    }
    const line = mindMap.linesGroup.path(path);
    line.fill("none");
    const { lineColor, lineWidth } = mindMap.canvas;
    line.stroke({ color: lineColor, width: lineWidth });
  }
};
