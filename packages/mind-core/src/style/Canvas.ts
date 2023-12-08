import { IDefaultTheme, Theme } from "./theme";

export class Canvas implements IDefaultTheme {
  constructor() {
    const theme = new Theme();
    const defalutTheme = theme.defalutTheme;
    if (defalutTheme) {
      // 深度赋值
      Object.assign(this, defalutTheme);
    }
  }
}
