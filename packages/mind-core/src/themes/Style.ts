import { G, Rect, Text } from "@svgdotjs/svg.js";
import { defaultTheme } from "./default";
import type { ITheme, IDefaultTheme, IThemeType, INodeTheme } from "./index.d";

export class Style {
  defalutTheme!: IDefaultTheme;
  root!: INodeTheme;
  second!: INodeTheme;
  node!: INodeTheme;
  generalization!: INodeTheme;

  constructor(theme: ITheme = defaultTheme) {
    this.useTheme(theme);
  }

  static mergeTheme(theme: ITheme, defaultConfig: ITheme = defaultTheme) {
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
      generalization: { ..._generalization, ...generalization }
    };
  }

  /** 使用主题 */
  useTheme(theme: ITheme) {
    const { root, second, node, generalization, ...config } =
      Style.mergeTheme(theme);
    this.defalutTheme = config;
    this.root = root;
    this.second = second;
    this.node = node;
    this.generalization = generalization;
  }

  setNodeStyleByTheme(node: G, theme: IThemeType = "node") {
    const textNode = node.findOne(".text") as Text;
    const thisNode = node.findOne(".node") as Rect;
    const borderNode = node.findOne(".node-border") as Rect;
    const {
      color,
      paddingX = 0,
      paddingY = 0,
      borderColor,
      borderRadius = 0,
      fillColor
    } = this[theme] as INodeTheme;

    let width = 0;
    let height = 0;
    if (textNode) {
      textNode.fill({ color }).css({ cursor: "pointer" });
      const bbox = textNode.bbox();
      width = bbox.width;
      height = bbox.height;
    }
    if (thisNode) {
      thisNode.size(width + paddingX * 2, height + paddingY * 2);
      thisNode.css("cursor", "pointer").radius(borderRadius);
      thisNode.fill({ color: fillColor }).cx(0).cy(0);
    }
    if (borderNode) {
      borderNode.size(width + paddingX * 2 + 8, height + paddingY * 2 + 8);
      borderNode.stroke({ color: borderColor });
      // 默认填充的是黑色,所以要设置成完全透明
      borderNode.css("cursor", "pointer").fill({ opacity: 0 });
      borderNode.radius(borderRadius).cx(0).cy(0);
    }
    // node.fill(fill).stroke(stroke).strokeWidth(strokeWidth);
  }
}
