import { ColorCalc } from "../types";
import { rgb2lab } from "./toLab";
import { hex2rgb } from "./toRgb";

/**
 *
 * @param {ColorCalc} lab  The color in the LAB color space
 * @return {number[]}  [h, c, l]
 */
export function lab2hcl(lab: ColorCalc) {
  const [l, a, b] = lab;
  const hr = Math.atan2(b, a);
  const c = Math.sqrt(a * a + b * b);
  let h;

  h = (hr * 360) / 2 / Math.PI;

  if (h < 0) {
    h += 360;
  }

  return [h, c, l];
}

export function rgb2hcl(rgb: ColorCalc) {
  return lab2hcl(rgb2lab(rgb));
}

export function hex2hcl(hex: string) {
  return rgb2hcl(hex2rgb(hex));
}
