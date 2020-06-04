import { ColorCalc } from "../types";
import { lab2xyz } from "./toXyz";
import { hcl2lab } from "./toLab";
/**
 * MUI functions
 */
export function hex2rgb(hex: any) {
  let hexString: string = Array.from(hex).join("");

  return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
    .exec(hexString)
    .slice(1)
    .map((s) => parseInt(s, 16));
}

export function hcl2rgb(hcl: ColorCalc) {
  return lab2rgb(hcl2lab(hcl));
}

export function lab2rgb(lab: ColorCalc) {
  const [x, y, z] = lab2xyz(lab);
  let r: number = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g: number = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let b: number = x * 0.0557 + y * -0.204 + z * 1.057;

  return [r, g, b].map((val) => {
    val =
      val > 0.0031308 ? 1.055 * Math.pow(val, 1 / 2.4) - 0.055 : 12.92 * val;

    return Math.max(0, Math.min(1, val)) * 255;
  });
}

/**
 * NON-Mui functions
 */
// https://css-tricks.com/converting-color-spaces-in-javascript/
export function hexToRGB(hex: string, isPct: boolean = false) {
  let r: any = 0,
    g: any = 0,
    b: any = 0;

  if (hex.length == 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
  } else if (hex.length == 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }

  if (isPct) {
    r = +((r / 255) * 100).toFixed(1);
    g = +((g / 255) * 100).toFixed(1);
    b = +((b / 255) * 100).toFixed(1);
  }

  return {
    r,
    g,
    b,
    string:
      "rgb(" +
      (isPct ? r + "%," + g + "%," + b + "%" : +r + "," + +g + "," + +b) +
      ")",
  };
}
