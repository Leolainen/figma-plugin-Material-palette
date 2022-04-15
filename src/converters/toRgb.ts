import { ColorCalc, RGB } from "../types";
import { lab2xyz } from "./toXyz";
import { hcl2lab } from "./toLab";

export function lab2rgb(lab: ColorCalc) {
  const [x, y, z] = lab2xyz(lab);
  const r: number = x * 3.2406 + y * -1.5372 + z * -0.4986;
  const g: number = x * -0.9689 + y * 1.8758 + z * 0.0415;
  const b: number = x * 0.0557 + y * -0.204 + z * 1.057;

  return [r, g, b].map((val) => {
    const valCalc =
      val > 0.0031308 ? 1.055 * val ** (1 / 2.4) - 0.055 : 12.92 * val;
    // Math.pow(val, 1 / 2.4)

    return Math.max(0, Math.min(1, valCalc)) * 255;
  });
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
