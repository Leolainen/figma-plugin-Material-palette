import { ColorCalc } from "../types";
import { rgb2xyz } from "./toXyz";

export function rgb2lab(rgb: ColorCalc) {
  let [x, y, z] = rgb2xyz(rgb);

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

  const l = 116 * y - 16;
  const a = 500 * (x - y);
  const b = 200 * (y - z);

  return [l, a, b];
}

export function hcl2lab(hcl: ColorCalc) {
  // eslint-disable-next-line prefer-const
  let [h, c, l] = hcl;

  const hr = (h / 360) * 2 * Math.PI;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);

  return [l, a, b];
}
