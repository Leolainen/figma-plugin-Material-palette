import { ColorCalc, RGB } from "../types";
import { hcl2rgb } from "./toRgb";

export function rgb2hex(rgb: ColorCalc) {
  const [r, g, b] = rgb;
  const rgbCalc: number = (r << 16) | (g << 8) | b;

  return `#${`000000${rgbCalc.toString(16)}`.slice(-6)}`;
}

export function hcl2hex(hcl: ColorCalc) {
  return rgb2hex(hcl2rgb(hcl));
}

export function HSLToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r: any = 0;
  let g: any = 0;
  let b: any = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length === 1) r = `0${r}`;
  if (g.length === 1) g = `0${g}`;
  if (b.length === 1) b = `0${b}`;

  return `#${r}${g}${b}`;
}

/**
 * @param {RGB} rgb Expects an object of r, g, b. ex: { r: 20, g: 177, b: 161 }
 * @return {string} Hex color
 */
export function RGBToHex(rgb: RGB) {
  const { r, g, b } = rgb;
  let rString = r.toString(16);
  let gString = g.toString(16);
  let bString = b.toString(16);

  if (rString.length === 1) rString = `0${r}`;
  if (gString.length === 1) gString = `0${g}`;
  if (bString.length === 1) bString = `0${b}`;

  return `#${rString}${gString}${bString}`;
}
