import { Layout } from "./Layout";
import { nonLayeredTidyTree } from "../algorithms";

export class UpwardOrganizational extends Layout {
  doLayout() {
    const root = this.root;
    nonLayeredTidyTree(root, false);
    root.down2up();
    return root;
  }
}
