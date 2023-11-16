import { SVG } from "@svgdotjs/svg.js";

/**
 *
 * @param a
 * @param b
 * @returns
 */
export const sum = (a: number, b: number) => {
  return a + b;
};

export const craeteSVGDom = () => {
  const draw = SVG().size(300, 300);
  draw.rect(100, 100).attr({ fill: "#f06" });
  return draw;
};
