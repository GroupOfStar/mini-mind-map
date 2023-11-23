import { Layout } from "./Layout";
import { nonLayeredTidyTree } from "./../algorithms";

export class DownwardOrganizational extends Layout {
  doLayout() {
    const root = this.root;
    return nonLayeredTidyTree(root, false);
  }
}
