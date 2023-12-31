import { Layout } from "./Layout";
import { nonLayeredTidyTree2 } from "../algorithms";
import { WrapperdTree2 } from "../hierarchy/WrapperdTree2";

export class RightLogical extends Layout {
  doLayout() {
    const wt = nonLayeredTidyTree2(this.rootNode, true);
    WrapperdTree2.convertBack(wt, this.rootNode);
    return this.rootNode;
  }
}
