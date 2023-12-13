import { Layout } from "./Layout";
import { nonLayeredTidyTree } from "../algorithms";

export class DownwardOrganizational extends Layout {
  doLayout() {
    const rootNode = this.rootNode;
    return nonLayeredTidyTree(rootNode, false);
  }
}
