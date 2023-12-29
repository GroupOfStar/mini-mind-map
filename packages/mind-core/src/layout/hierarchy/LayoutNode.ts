import type { ILayoutNodePorps } from "./index.d";

export class LayoutNode implements ILayoutNodePorps<LayoutNode> {
  id: any;
  name: string;
  width: number;
  height: number;
  hGap: number;
  vGap: number;
  children: LayoutNode[];
  x: number = 0;
  y: number = 0;

  constructor(props: ILayoutNodePorps<LayoutNode>) {
    this.id = props.id;
    this.name = props.name;
    this.width = props.width;
    this.height = props.height;
    this.hGap = props.hGap;
    this.vGap = props.vGap;
    this.children = props.children || [];
  }
}
