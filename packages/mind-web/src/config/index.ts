import type { ILayoutType } from "@mini-mind-map/mind-core";
// 侧边栏列表
export const sidebarTriggerList = [
  {
    name: "样式",
    value: "nodeStyle",
    icon: "icon-mind icon-styles",
    tool: false,
  },
  {
    name: "结构风格",
    value: "theme",
    icon: "icon-mind icon-stru",
    tool: false,
  },
  {
    name: "大纲",
    value: "outline",
    icon: "icon-mind icon-outlines",
    tool: false,
  },
  {
    name: "插入同级节点（Enter）",
    value: "INSERT_NODE",
    icon: "icon-mind icon-sub-theme",
    tool: false,
  },
  {
    name: "插入子级节点（Tab）",
    value: "INSERT_CHILD_NODE",
    icon: "icon-mind icon-peer-theme",
    tool: false,
  },
  {
    name: "概要",
    value: "ADD_GENERALIZATION",
    icon: "icon-mind icon-summary",
    tool: false,
  },
  {
    name: "插入图标",
    value: "nodeIcon",
    icon: "icon-mind icon-moji",
    tool: false,
  },
  {
    name: "插入图片",
    value: "nodeImage",
    icon: "icon-mind icon-image",
    tool: false,
  },
  {
    name: "插入标签",
    value: "nodeTag",
    icon: "icon-mind icon-tag",
    tool: false,
  },
];

//  布局结构列表
export const layoutList: Array<IStatusEnum<ILayoutType>> = [
  {
    title: "右侧分布",
    value: "RightLogical",
  },
  {
    title: "左侧分布",
    value: "LeftLogical",
  },
  {
    title: "标准分布",
    value: "Standard",
  },
  {
    title: "组织架构图",
    value: "DownwardOrganizational",
  },
  {
    title: "向上分布",
    value: "UpwardOrganizational",
  },
];
