import { defaultTheme } from "./default";
import type { ITheme, IDefaultTheme, INodeTheme, INodeType } from ".";

export class Theme implements Record<INodeType, INodeTheme> {
  static instance?: Theme;

  root!: INodeTheme;
  second!: INodeTheme;
  node!: INodeTheme;
  defalutTheme!: IDefaultTheme;
  generalization!: INodeTheme;

  constructor(theme: ITheme = defaultTheme) {
    // 单例模式
    if (Theme.instance) {
      return Theme.instance;
    }
    this.useTheme(theme);
    return (Theme.instance = this);
  }

  /**
   * 合并主题配置
   * @param {ITheme} theme 使用的主题
   * @param {ITheme} defaultConfig 主题的通用配置
   * @returns {ITheme} 合并后的主题配置
   */
  static mergeTheme(theme: Partial<ITheme>, defaultConfig: ITheme = defaultTheme): ITheme {
    const { root, second, node, generalization, ...config } = theme;
    const {
      root: _root,
      second: _second,
      node: _node,
      generalization: _generalization,
      ..._config
    } = defaultConfig;
    return {
      ..._config,
      ...config,
      root: { ..._root, ...root },
      second: { ..._second, ...second },
      node: { ..._node, ...node },
      generalization: { ..._generalization, ...generalization },
    };
  }

  /**
   * 使用某一主题
   * @param theme 目前已有在主题有 蓝色系: blueGray, 商务: deepPurple
   */
  useTheme(theme: ITheme) {
    const { root, second, node, generalization, ...config } = Theme.mergeTheme(theme);
    this.defalutTheme = config;
    this.root = root;
    this.second = second;
    this.node = node;
    this.generalization = generalization;
  }
}
