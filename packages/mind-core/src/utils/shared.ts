import { isNumber } from "./lodash";
import type { IFontOption } from "./index.d";

/**
 * 转换规范化可以使用在svgjs节点上的id
 * @param id node数据上的id
 * @returns 规范化的id
 */
export function normalNodeId(id: string | number) {
  return id.toString().trim().replace(/#|-/g, "");
}

/**
 * 根据文本字体配置获取字体字符串
 * @param fontOption 文本font配置
 * @returns 字体字符串
 */
export function joinFontStr(fontOption: IFontOption) {
  const {
    size = 16,
    family = "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
    italic = "italic",
    bold = "bold",
  } = fontOption;
  return `${italic} ${bold} ${size}px ${family} `;
}

/**
 * 计算文本在浏览器中的宽高
 * @param text 文本
 * @param fontOption 文本font配置
 * @returns 宽高
 */
export function measureText(text: string = "a", fontOption: IFontOption = {}) {
  const font = joinFontStr(fontOption);
  const measureTextContext = document.createElement("canvas").getContext("2d");
  const textSize = { width: 0, height: 0 };
  if (measureTextContext) {
    measureTextContext.save();
    measureTextContext.font = font;
    const textMetrics = measureTextContext.measureText(text);
    textSize.width = textMetrics.width;
    textSize.height = textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent;
    measureTextContext.restore();
  }
  return textSize;
}

/** 转换换行文本 */
export function getWrapString(str: string, width: number, fontOption: IFontOption): string[] {
  if (!str || !isNumber(width)) {
    return [str];
  }
  const normalText = str
    .replace(/&nbsp;/g, "")
    .replace(/<br>/gim, "\n")
    .split(/\n/gim);
  // 截取最后2个元素
  const lastTowStr = normalText.slice(-2);
  // 如果最后2个元素都为空，则删除一个
  if (lastTowStr.every((item) => !item)) {
    normalText.pop();
  }
  return normalText
    .map((item) => {
      const arr = item.split("");
      const lines: string[] = [];
      let line: string[] = [];
      while (arr.length) {
        const lastStr = arr.shift() || "";
        const text = [...line, lastStr].join("");
        if (measureText(text, fontOption).width <= width) {
          line.push(lastStr);
        } else {
          lines.push(line.join(""));
          line = [lastStr];
        }
      }
      if (line.length > 0) {
        lines.push(line.join(""));
      }
      return lines.join("\n");
    })
    .join("\n")
    .split("\n");
}

/**
 * 将svg导出成图片
 * @param node svg节点 => document.querySelector('svg')
 * @param name 生成的图片名称
 * @param width 生成的图片宽度
 * @param height 生成的图片高度
 * @param type 生成的图片类型
 */
export const covertSVG2Image = (
  node: SVGSVGElement,
  name: string,
  width: number,
  height: number,
  type = "png"
) => {
  const serializer = new XMLSerializer();
  const source = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(node);
  const image = new Image();
  image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (context) {
    context.fillStyle = "#fff";
    context.fillRect(0, 0, 10000, 10000);
    image.onload = function () {
      context.drawImage(image, 0, 0);
      const a = document.createElement("a");
      a.download = `${name}.${type}`;
      a.href = canvas.toDataURL(`image/${type}`);
      a.click();
    };
  }
};
