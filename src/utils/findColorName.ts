import { BASECOLOR } from "../constants";
import { hex2hcl } from "../converters/toHcl";
import type { BaseColorKey } from "../types";

/**
 * find what color name best describes the provided hex
 * (eg: green, red, deepPurple ...)
 */
export function findColorName(hex: string): BaseColorKey {
  const [h] = hex2hcl(hex);

  let baseColor: BaseColorKey = "grey";
  let dist = 360;

  // loop through each basecolor and set the baseColor
  Object.keys(BASECOLOR.material).forEach((baseColorName) => {
    const baseColorHex = BASECOLOR.material[baseColorName as BaseColorKey];

    // picks out the HCL values from each set material basecolor
    const [hue] = hex2hcl(baseColorHex);
    const _dist = Math.min(Math.abs(h - hue), 360 + h - hue);

    // we've found our basecolor if _dist is lower than dist
    if (_dist < dist) {
      dist = _dist;
      baseColor = baseColorName as BaseColorKey;
    }
  });

  return baseColor;
}
