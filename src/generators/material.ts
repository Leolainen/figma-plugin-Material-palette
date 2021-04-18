import { BASECOLOR, COLORKEYS } from "../constants";
import { materialColorSchema } from "../schemas";
import { hcl2hex } from "../converters/toHex";
import { hex2rgb, hexToRGB } from "../converters/toRgb";
import { hex2hcl, rgb2hcl } from "../converters/toHcl";
import { hexToHSL } from "../converters/toHsl";
import { RgbHslHexObject, BaseColorKey } from "../types";

/**
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * @
 * @  ORIGINAL ALGORITHM BUILT BY SEBASTIAN LASSE
 * @  https://codepen.io/sebilasse/pen/GQYKJd
 * @
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
export const hexColorReg = /^#?([A-F0-9]{6}|[A-F0-9]{3})$/i;

function specificLight(rgb: number[]) {
  const [r, g, b] = rgb;
  return 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function colorData(hex: string, palette: any = undefined) {
  const rgb = hex2rgb(!palette ? hex : palette[hex]);
  const hcl = rgb2hcl(rgb);
  const colorData = { rgb, hcl, sl: specificLight(rgb) };

  return colorData;
}

export function getSpecificLight(hex: string): number {
  const rgb = hex2rgb(hex);
  const hcl = rgb2hcl(rgb);
  return hcl[2] * specificLight(rgb);
}

/**
 * Acts like a sort of limiter.
 *
 * These checks overrides the basecolor so the usual schema for the color wouldn't apply.
 * This is due to some darker variants of colors (eg red) not looking very good.
 * Brown is for instance much "calmer" and doesn't include blue tones which red
 * otherwise does.
 *
 * This is pretty much 100% personal preference and can be tweaked quite a bit!
 */
function compressBasecolor(baseColor: BaseColorKey, hex): BaseColorKey {
  const { hcl, sl } = colorData(hex);
  const [hue, chroma, luminance] = hcl;

  const checkBrown = { orange: 1, deepOrange: 1, red: 1 };
  const checkBlue = {
    indigo: 1,
    blue: 1,
    lightBlue: 1,
    cyan: 1,
    blueGrey: 1,
    deepPurple: 1,
  };

  if (baseColor === "deepPurple" && chroma < 60 && luminance < 26) {
    baseColor = "blueGrey";
  }

  if (checkBrown.hasOwnProperty(baseColor) && chroma < 48) {
    baseColor = chroma < 12 ? "grey" : "brown";
  } else if (checkBlue.hasOwnProperty(baseColor) && chroma < 56 && sl > 0.32) {
    baseColor = "blueGrey";
  } else if (chroma < 16) {
    baseColor = "grey";
  }

  return baseColor;
}

/**
 * find which basecolor schema to use based on the provided hex
 */
function findClosestBaseColor(hex: string): BaseColorKey {
  const { hcl, sl } = colorData(hex);
  const [h, c, l] = hcl;

  let baseColor: BaseColorKey = "grey";
  let dist = 360;

  // loop through each basecolor and set the baseColor
  Object.keys(BASECOLOR.material).forEach((baseColorName: BaseColorKey) => {
    const baseColorHex = BASECOLOR.material[baseColorName];

    // picks out the HCL values from each set material basecolor
    let [hue] = hex2hcl(baseColorHex);
    let _dist = Math.min(Math.abs(hue - h), 360 + hue - h);

    // we've found our basecolor if _dist is lower than dist
    if (_dist < dist) {
      dist = _dist;
      baseColor = baseColorName;
    }
  });

  return compressBasecolor(baseColor, hex);
}

/**
 * Uses the matericalColorScheme to calculate each hue with HCL
 *
 * ex:
 * basecolor = "red" (#f44336 which in hcl is {h: 14, c: 143, l: 56})
 * materialColorSchema.red.0 = [-28, -74, 39]
 * @return = {h: -14, c: 69, l: 95}
 */
function materialScale(hex: string, baseColor: BaseColorKey) {
  const { hcl } = colorData(hex);

  // Some colors have accent colors. some don't. We check for that here.
  const colorKeys =
    materialColorSchema[baseColor].length < COLORKEYS.length
      ? COLORKEYS.slice(0, 9)
      : COLORKEYS;

  return colorKeys.reduce((acc: object, curr: string, idx: number) => {
    const modifiedHCL: Array<number> = materialColorSchema[baseColor][idx].map(
      (rangeValue, index) => hcl[index] + rangeValue
    );

    acc[curr] = hcl2hex(modifiedHCL);

    // 500 does not exist in the COLORKEYS constant so we have to fill it here
    // 500 is also the base hex inputted by the user
    if (curr === "400") {
      acc["500"] = hex;
    }

    return acc;
  }, {});
}

function generateMaterialHexPalette(hex: string) {
  const baseColor = findClosestBaseColor(hex);

  return materialScale(hex, baseColor);
}

export function generateMaterialPalette(
  baseColor: RgbHslHexObject
): RgbHslHexObject[] {
  try {
    const hexPalette = generateMaterialHexPalette(baseColor.hex);

    return Object.keys(hexPalette).map((key) => ({
      rgb: hexToRGB(hexPalette[key], true),
      hsl: hexToHSL(hexPalette[key]),
      hex: hexPalette[key],
    }));
  } catch (e) {
    console.error("error: ", e);

    return undefined;
  }
}
