interface IFontString {
  fontSize: number;
  fontFamily?: string;
  italic?: string;
  bold?: string;
}

/**
 * 工具类
 */
export class Utils {
  private static measureTextContext: CanvasRenderingContext2D | null = null;

  // 拼接font字符串
  private static joinFontStr(fontStr: IFontString) {
    const italic = fontStr.italic ? "italic" : "";
    const bold = fontStr.bold ? "bold" : "";
    return `${italic} ${bold} ${fontStr.fontSize}px ${fontStr.fontFamily} `;
  }

  // 计算节点的文本长宽
  static measureText(
    text: string,
    fontStr: IFontString = {
      fontSize: 16,
      fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif"
    }
  ) {
    const font = this.joinFontStr(fontStr);
    if (!this.measureTextContext) {
      const canvas = document.createElement("canvas");
      this.measureTextContext = canvas.getContext("2d");
    }

    const textSize = { width: 0, height: 0 };
    if (this.measureTextContext) {
      this.measureTextContext.save();
      this.measureTextContext.font = font;
      const textMetrics = this.measureTextContext.measureText(text);
      textSize.width = textMetrics.width;
      textSize.height =
        textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent;
      this.measureTextContext.restore();
    }
    return textSize;
  }

  // 防抖
  static debounce(fn: Function, delay: number = 300) {
    let timer: NodeJS.Timeout | null = null;
    return (...args: any[]) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    };
  }
}
