import { HSLToHex } from "../converters/toHex";
import { hexToHSL } from "../converters/toHsl";
import { RgbHslHexObject } from "../types";
import { hexToRGB } from "../converters/toRgb";

function createBrighterColors(baseColor: RgbHslHexObject, length = 5) {
  const maxSaturation = 100;
  const maxLightness = 100;
  let sModHolder = 0;
  let lModHolder = 0;

  return Array.from(new Array(length), () => {
    const { h, s, l } = baseColor.hsl;

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

    const hex = HSLToHex(h, s, lModHolder);

    return {
      rgb: hexToRGB(hex, true),
      hsl: hexToHSL(hex),
      hex,
    };
  });
}

function createDarkerColors(
  baseColor: RgbHslHexObject,
  length = 4,
  hModMultiplier = 0.02
) {
  let sModHolder = 0;
  let lModHolder = 0;
  let hModHolder = 0;

  return Array.from(new Array(length), () => {
    const { h, s, l } = baseColor.hsl;

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

    const hex = HSLToHex(hModHolder, sModHolder, lModHolder);

    return {
      rgb: hexToRGB(hex, true),
      hsl: hexToHSL(hex),
      hex,
    };
  });
}

export function generateMonochromePalette(
  baseColor: RgbHslHexObject,
  trueMonochrome = false
) {
  const brighterColors: RgbHslHexObject[] = createBrighterColors(
    baseColor
  ).reverse();
  const darkerColors: RgbHslHexObject[] = trueMonochrome
    ? createDarkerColors(baseColor, 4, 0)
    : createDarkerColors(baseColor);
  const palette: RgbHslHexObject[] = [
    ...brighterColors,
    baseColor,
    ...darkerColors,
  ];

  return palette;
}
