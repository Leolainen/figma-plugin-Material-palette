import { ColorCalc } from "../types";
import { rgb2xyz } from "./toXyz";

export function rgb2lab(rgb: ColorCalc) {
  const [x, y, z] = rgb2xyz(rgb);
  const lab: ColorCalc = [116 * y - 16, 500 * (x - y), 200 * (y - z)];

  return lab;
}

export function hcl2lab(hcl: ColorCalc) {
  // eslint-disable-next-line prefer-const
  let [h, c, l] = hcl;

  h *= Math.PI / 180;

  const lab: ColorCalc = [l, Math.cos(h) * c, Math.sin(h) * c];

  return lab;
}
