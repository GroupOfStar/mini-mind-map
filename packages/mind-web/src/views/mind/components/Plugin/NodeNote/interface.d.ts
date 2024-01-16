/** Contextmenu组件propsType */
export const NodeNotePropsDefine = {
  /** 数据集 */
  mindMap: {
    type: Object as PropType<Graph>,
    required: true,
  },
  /** 备注弹出visible */
  nodeNoteVisible: {
    type: Object as PropType<Ref<boolean>>,
    required: true,
  },
  position: {
    type: Object as PropType<{ x: number; y: number }>,
    required: true,
  },
} as const;

export interface INodeNoteExpose {
  ref: HTMLElement;
}
