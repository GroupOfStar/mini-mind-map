import { Layout } from "./Layout";
import { nonLayeredTidyTree } from "../algorithms";

export class UpwardOrganizational extends Layout {
  doLayout() {
    const rootNode = this.rootNode;
    nonLayeredTidyTree(rootNode, false);
    rootNode.down2up();
    return rootNode;
  }
}
