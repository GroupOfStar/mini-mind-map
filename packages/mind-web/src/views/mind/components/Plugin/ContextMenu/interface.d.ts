/** Contextmenu组件propsType */
export const ContextMenuPropsDefine = {
  /** 数据集 */
  mindMap: {
    type: Object as PropType<Graph>,
    required: true,
  },
  contextMenuVisible: {
    type: Object as PropType<Ref<boolean>>,
    required: true,
  },
  position: {
    type: Object as PropType<{ x: number; y: number }>,
    required: true,
  },
} as const;

/** 菜单type */
export type IMenuType = "INSERT_NODE" | "NOTE";

/**
 * ref
 */
export interface IContextMenuExpose {
  ref: HTMLElement;
}
