import { ColorCalc, RGB } from "../types";
import { lab2xyz } from "./toXyz";
import { hcl2lab } from "./toLab";

/**
 * MUI functions
 */

export function hex2rgb(hex: string) {
  const match = hex.match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
  if (!match) {
    return [0, 0, 0];
  }

  let colorString = match[0];

  if (match[0].length === 3) {
    colorString = colorString
      .split("")
      .map(function (char) {
        return char + char;
      })
      .join("");
  }

  const integer = parseInt(colorString, 16);
  const r = (integer >> 16) & 0xff;
  const g = (integer >> 8) & 0xff;
  const b = integer & 0xff;

  return [r, g, b];
}

export function xyz2rgb(xyz: ColorCalc) {
  const x = xyz[0] / 100;
  const y = xyz[1] / 100;
  const z = xyz[2] / 100;

  let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let b = x * 0.0557 + y * -0.204 + z * 1.057;

  // assume sRGB
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1.0 / 2.4) - 0.055 : r * 12.92;

  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1.0 / 2.4) - 0.055 : g * 12.92;

  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1.0 / 2.4) - 0.055 : b * 12.92;

  r = Math.min(Math.max(0, r), 1);
  g = Math.min(Math.max(0, g), 1);
  b = Math.min(Math.max(0, b), 1);

  return [r * 255, g * 255, b * 255];
}

export function lab2rgb(lab: ColorCalc) {
  return xyz2rgb(lab2xyz(lab));
}

export function hcl2rgb(hcl: ColorCalc) {
  return lab2rgb(hcl2lab(hcl));
}

/**
 * NON-Mui functions
 */
// https://css-tricks.com/converting-color-spaces-in-javascript/
export function hexToRGB(hex: string, isPct = false): RGB {
  let r = 0;
  let g = 0;
  let b = 0;

  if (hex.length === 4) {
    r = Number(`0x${hex[1]}${hex[1]}`);
    g = Number(`0x${hex[2]}${hex[2]}`);
    b = Number(`0x${hex[3]}${hex[3]}`);
  } else if (hex.length === 7) {
    r = Number(`0x${hex[1]}${hex[2]}`);
    g = Number(`0x${hex[3]}${hex[4]}`);
    b = Number(`0x${hex[5]}${hex[6]}`);
  }

  if (isPct) {
    r = +((Number(r) / 255) * 100).toFixed(1);
    g = +((Number(g) / 255) * 100).toFixed(1);
    b = +((Number(b) / 255) * 100).toFixed(1);
  }

  return {
    r,
    g,
    b,
    string: `rgb(${isPct ? `${r}%,${g}%,${b}%` : `${+r},${+g},${+b}`})`,
  };
}
