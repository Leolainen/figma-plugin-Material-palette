import { ColorCalc } from "./types";
import { rgb2lab } from "./toLab";
import { hex2rgb } from "./toRgb";
// Hue Chroma Luminance
/**
 * MUI functions
 */
export function hex2hcl(hex: ColorCalc) {
  return rgb2hcl(hex2rgb(hex));
}

export function rgb2hcl(rgb: ColorCalc) {
  return lab2hcl(rgb2lab(rgb));
}

export function lab2hcl(lab: ColorCalc) {
  const [l, a, b] = lab;
  const c = Math.sqrt(a * a + b * b);
  const h = (Math.atan2(b, a) * (180 / Math.PI) + 360) % 360;

  return [Math.round(c * 10000) === 0 ? 0 : h, c, l];
}

/**
 * NON-Mui functions
 */
