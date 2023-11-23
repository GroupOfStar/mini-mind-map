import { Layout } from "./Layout";
import { nonLayeredTidyTree } from "../algorithms";

export class LeftLogical extends Layout {
  doLayout() {
    const root = this.root;
    nonLayeredTidyTree(root, true);
    root.right2left();
    return root;
  }
}
