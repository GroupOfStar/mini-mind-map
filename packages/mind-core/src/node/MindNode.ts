import { G, Rect, Text } from "@svgdotjs/svg.js";
import { IMindDataItem } from "src/graph";

export class MindNode {
  mindGroup: G;
  id: string;
  parentId: "root" | string;
  type: string;
  //   text?: string;
  //   expand?: boolean;
  //   color?: string;
  //   children?: MindNode[];

  rectConfig = {
    stroke: { width: 2, color: "#837a5c" },
    padding: 4,
    fill: { color: "#f06", opacity: 0.5 }
  };

  nodeGroup: G;

  constructor(group: G, node: IMindDataItem) {
    console.log("MindNode constructor");
    this.mindGroup = group;
    this.id = node.id;
    this.parentId = node.parentId;
    this.type = node.type;

    this.nodeGroup = new G({ id: node.id });
    // this.nodeGroup.add
    const rectNode = new Rect()
      .size("100%", "100%")
      .stroke(this.rectConfig.stroke)
      .fill(this.rectConfig.fill);
    const textNode = new Text({ class: "textClass" }).text(node.text || "");
    this.nodeGroup.add(rectNode);
    this.nodeGroup.add(textNode);
    this.mindGroup.add(this.nodeGroup);
  }

  getTextNodeRect() {
    const fidText = this.nodeGroup.findOne("text.textClass") as Text;
    const textRect = fidText?.node.getBoundingClientRect();
    console.log("textRect :>> ", textRect);
    const { padding } = this.rectConfig;
    if (fidText) {
      fidText.x(padding).y(padding);
    }
    return textRect;
  }
  setGroupNodeSize() {
    const { padding } = this.rectConfig;
    const width = padding * 2 + (this.getTextNodeRect()?.width || 0);
    const height = padding * 2 + (this.getTextNodeRect()?.height || 0);
    const rectNode = this.nodeGroup.findOne("rect") as Rect;
    if (rectNode) {
      rectNode.size(width, height);
    }
  }
  moveTo(x: number, y: number) {
    this.nodeGroup.x(x).y(y);
  }
}
