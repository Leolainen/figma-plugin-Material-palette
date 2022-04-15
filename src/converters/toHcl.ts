import Color from "colorjs.io";
import { ColorCalc } from "../types";
import { rgb2lab } from "./toLab";

/**
 *
 * @param {ColorCalc} lab  The color in the LAB color space
 * @return {number[]}  [h, c, l]
 */
export function lab2hcl(lab: ColorCalc) {
  const [l, a, b] = lab;
  const c = Math.sqrt(a * a + b * b);
  const h = (Math.atan2(b, a) * (180 / Math.PI) + 360) % 360;

  return [Math.round(c * 10000) === 0 ? 0 : h, c, l];
}

export function rgb2hcl(rgb: ColorCalc) {
  return lab2hcl(rgb2lab(rgb));
}

export function hex2hcl(hex: ColorCalc | string) {
  const color = new Color(hex);
  const [l, c, h] = color.lch;

  return [h, c, l];
}
