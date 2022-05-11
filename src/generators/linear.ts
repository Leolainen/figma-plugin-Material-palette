import { hslToHex } from "../converters/toHex";
import { hexToHSL } from "../converters/toHsl";
import { Palette } from "../types";
import { FULL_COLOR_KEYS } from "../constants";
import { LinearSettings } from "../store/types/settings";

function createBrighterColors(baseColor: string, settings: LinearSettings) {
  const hueMultiplier = settings.hueMultiplier / 100;
  const lightnessMultiplier = 1 + settings.lightnessMultiplier / 100; // no lightness = no palette
  const saturationMultiplier = settings.saturationMultiplier / 100;
  const LENGTH = 5; // editable in the future?

  const maxSaturation = 100;
  const maxLightness = 100;
  let sModHolder = 0;
  let lModHolder = 0;
  let hModHolder = 0;

  return Array.from(new Array(LENGTH), () => {
    const { h, s, l } = hexToHSL(baseColor);

    if (sModHolder === 0 && lModHolder === 0) {
      const sDiff = maxSaturation - s;
      const lDiff = maxLightness - l;

      sModHolder = s + sDiff * 0.05 * saturationMultiplier;
      lModHolder = l + lDiff * 0.25 * lightnessMultiplier;
      hModHolder =
        h + h * hueMultiplier > 360
          ? h + h * hueMultiplier - 360
          : h + h * hueMultiplier;
    } else {
      const sDiff = maxSaturation - sModHolder;
      const lDiff = maxLightness - lModHolder;

      sModHolder += sDiff * 0.05 * saturationMultiplier;
      lModHolder += lDiff * 0.25 * lightnessMultiplier;
      hModHolder =
        hModHolder + hModHolder * hueMultiplier > 360
          ? hModHolder + hModHolder * hueMultiplier - 360
          : hModHolder - hModHolder * hueMultiplier;
    }

    const hex = hslToHex(hModHolder, sModHolder, lModHolder);

    return hex;
  });
}

function createDarkerColors(baseColor: string, settings: LinearSettings) {
  const hueMultiplier = settings.hueMultiplier / 100;
  const lightnessMultiplier = 1 + settings.lightnessMultiplier / 100; // no lightness = no palette
  const saturationMultiplier = settings.saturationMultiplier / 100;

  const LENGTH = 4;
  let sModHolder = 0;
  let lModHolder = 0;
  let hModHolder = 0;

  return Array.from(new Array(LENGTH), () => {
    const { h, s, l } = hexToHSL(baseColor);

    if (sModHolder === 0 && lModHolder === 0) {
      sModHolder = s - s * 0.2 * saturationMultiplier;
      lModHolder = l - l * 0.15 * lightnessMultiplier;
      hModHolder =
        h - h * hueMultiplier < 0
          ? h - h * hueMultiplier + 360
          : h - h * hueMultiplier;
    } else {
      sModHolder -= sModHolder * 0.1 * saturationMultiplier;
      lModHolder -= lModHolder * 0.15 * lightnessMultiplier;
      hModHolder =
        hModHolder - hModHolder * hueMultiplier < 0
          ? 360
          : hModHolder - hModHolder * hueMultiplier;
    }

    const hex = hslToHex(hModHolder, sModHolder, lModHolder);

    return hex;
  });
}

export function generateLinearPalette(
  baseColor: string,
  settings: LinearSettings
) {
  const brighterColors = createBrighterColors(baseColor, settings).reverse();
  const darkerColors = createDarkerColors(baseColor, settings);

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
