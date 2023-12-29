import { Layout } from "./Layout";
import { nonLayeredTidyTree } from "../algorithms";
import { WrapperdTree } from "../hierarchy";
import { forScopeEachTree } from "src/utils";

export class RightLogical extends Layout {
  doLayout() {
    this.layer(this.nodeTree, this.options, true);
    const wt = new WrapperdTree(this.nodeTree, this.options, true);
    nonLayeredTidyTree(this.nodeTree, wt, true);
    this.convertBack(wt, this.nodeTree, true);

    forScopeEachTree((node, index, parentNode) => {
      const { prelim = 0, mod = 0 } = node;
      console.log(node.name, " >>: prelim :", prelim, "mod :", mod);
    }, wt);
    return this.nodeTree;
  }
}
