import { Node } from "../node";

// 遍历节点
export type IForEachNode = (node: Node, index: number, parentNode?: Node) => void;
