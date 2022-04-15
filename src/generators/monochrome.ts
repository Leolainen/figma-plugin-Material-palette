import { hslToHex } from "../converters/toHex";
import { hexToHSL } from "../converters/toHsl";
import { Palette } from "../types";
import { FULL_COLOR_KEYS } from "../constants";

function createBrighterColors(baseColor: string, length = 5) {
  const maxSaturation = 100;
  const maxLightness = 100;
  let sModHolder = 0;
  let lModHolder = 0;

  return Array.from(new Array(length), () => {
    const { h, s, l } = hexToHSL(baseColor);

    if (sModHolder === 0 && lModHolder === 0) {
      const sDiff = maxSaturation - s;
      const lDiff = maxLightness - l;

      sModHolder = s + sDiff * 0.05;
      lModHolder = l + lDiff * 0.25;
    } else {
      const sDiff = maxSaturation - sModHolder;
      const lDiff = maxLightness - lModHolder;

      sModHolder += sDiff * 0.05;
      lModHolder += lDiff * 0.25;
    }

    const hex = hslToHex(h, s, lModHolder);

    return hex;
  });
}

function createDarkerColors(
  baseColor: string,
  length = 4,
  hModMultiplier = 0.02
) {
  let sModHolder = 0;
  let lModHolder = 0;
  let hModHolder = 0;

  return Array.from(new Array(length), () => {
    const { h, s, l } = hexToHSL(baseColor);

    if (sModHolder === 0 && lModHolder === 0) {
      sModHolder = s - s * 0.2;
      lModHolder = l - l * 0.15;
      hModHolder = h - h * hModMultiplier < 0 ? 360 : h - h * hModMultiplier;
    } else {
      sModHolder -= sModHolder * 0.1;
      lModHolder -= lModHolder * 0.15;
      hModHolder =
        hModHolder - hModHolder * hModMultiplier < 0
          ? 360
          : hModHolder - hModHolder * hModMultiplier;
    }

    const hex = hslToHex(hModHolder, sModHolder, lModHolder);

    return hex;
  });
}

export function generateMonochromePalette(
  baseColor: string,
  trueMonochrome = false
) {
  const brighterColors = createBrighterColors(baseColor).reverse();
  const darkerColors = trueMonochrome
    ? createDarkerColors(baseColor, 4, 0)
    : createDarkerColors(baseColor);

  /*
   * maps hex to a "mui" swatch. eg: `500; "#F1392B"`
   */
  const palette = [...brighterColors, baseColor, ...darkerColors].reduce(
    (acc, curr, idx) => {
      acc[FULL_COLOR_KEYS[idx]] = curr;
      return acc;
    },
    {} as Palette
  );

  return palette;
}
