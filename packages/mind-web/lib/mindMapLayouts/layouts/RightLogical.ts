import { Layout } from "./Layout";
import { nonLayeredTidyTree } from "../algorithms";

export class RightLogical extends Layout {
  doLayout() {
    const root = this.root;
    return nonLayeredTidyTree(root, true);
  }
}
