import type { ITheme } from ".";

/** 默认主题 */
export const defaultTheme: ITheme = {
  layout: "RightLogical",
  imgMaxWidth: 100,
  imgMaxHeight: 100,
  iconSize: 20,
  lineWidth: 2,
  lineColor: "#257BF1",
  lineDasharray: "none",
  lineStyle: "curve",
  generalizationLineWidth: 2,
  generalizationLineColor: "#7716D9",
  generalizationLineMargin: 5,
  generalizationNodeMargin: 20,
  backgroundColor: "#ffffff",
  backgroundImage: "",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  backgroundSize: "cover",
  nodeUseLineStyle: false,
  fontFamily: "Harmony Medium",
  root: {
    fontFamily: "Harmony Medium",
    paddingX: 32,
    paddingY: 12,
    shape: "rectangle",
    fillColor: "#257BF1",
    fontWeight: 600,
    fontSize: 24,
    color: "#ffffffcc",
    fontStyle: "normal",
    lineHeight: 1.5,
    lineWidth: 2,
    lineColor: "#257BF1",
    lineDasharray: "none",
    borderColor: "transparent",
    borderWidth: 0,
    borderDasharray: "none",
    borderRadius: 8,
    textDecoration: "none",
    active: {
      borderDasharray: "none",
      rectBorder: "#7716D9",
    },
  },
  second: {
    fontFamily: "Harmony Medium",
    paddingX: 20,
    paddingY: 8,
    shape: "rectangle",
    marginX: 46,
    marginY: 78,
    lineWidth: 2,
    lineColor: "#257BF1",
    lineDasharray: "none",
    fillColor: "#F5F6F7",
    color: "#333333",
    fontSize: 18,
    fontWeight: 400,
    fontStyle: "normal",
    lineHeight: 1.5,
    borderColor: "transparent",
    borderWidth: 1,
    borderDasharray: "none",
    borderRadius: 4,
    textDecoration: "none",
    active: {
      borderDasharray: "none",
      rectBorder: "#7716D9",
    },
  },
  node: {
    fontFamily: "Harmony Medium",
    paddingX: 12,
    paddingY: 4,
    shape: "rectangle",
    marginX: 50,
    marginY: 26,
    lineWidth: 2,
    lineColor: "#257BF1",
    lineDasharray: "none",
    fillColor: "#FAFAFA",
    color: "#666666",
    fontSize: 16,
    fontWeight: 400,
    fontStyle: "normal",
    lineHeight: 1.5,
    borderColor: "transparent",
    borderWidth: 1,
    borderRadius: 4,
    borderDasharray: "none",
    textDecoration: "none",
    active: {
      borderDasharray: "none",
      rectBorder: "#7716D9",
    },
  },
  generalization: {
    fontFamily: "Harmony Medium",
    paddingX: 15,
    paddingY: 5,
    shape: "rectangle",
    marginX: 100,
    marginY: 40,
    fillColor: " #7716D9",
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "noraml",
    fontStyle: "normal",
    lineHeight: 1.5,
    borderColor: "transparent",
    borderWidth: 1,
    borderDasharray: "none",
    borderRadius: 6,
    textDecoration: "none",
    active: {
      borderDasharray: "none",
      rectBorder: "#7716D9",
    },
  },
};
