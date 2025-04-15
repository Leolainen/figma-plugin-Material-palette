import { BASECOLOR, COLORKEYS } from "../constants";
import { hcl2hex } from "../converters/toHex";
import { hex2rgb } from "../converters/toRgb";
import { hex2hcl, rgb2hcl } from "../converters/toHcl";
import { materialColorSchema } from "../schemas";
import { BaseColorKey, Palette } from "../types";
import { MaterialSettings } from "../store/types/settings";

type BaseColorHexPair = {
  baseColor: BaseColorKey;
  hex: string;
};

export const hexColorReg = /^#?([A-F0-9]{6}|[A-F0-9]{3})$/i;

function specificLight(rgb: number[]) {
  const [r, g, b] = rgb;
  return 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function colorData(hex: string, palette: any = undefined) {
  const rgb = hex2rgb(!palette ? hex : palette[hex]);

  const hcl = rgb2hcl(rgb);
  const data = { rgb, hcl, sl: specificLight(rgb) };
  // const SL = hcl[2] * data.sl;

  return data;
}

/**
 * Acts like a sort of limiter.
 *
 * These checks overrides the base color so the usual schema for the color wouldn't apply.
 * This is due to some darker variants of colors (eg red) not looking very good.
 * Brown is for instance much "calmer" and doesn't include blue tones which red
 * otherwise does.
 *
 * This is pretty much 100% personal preference and can be tweaked quite a bit!
 *
 * @param {BaseColorHexPair} param0 Basecolor name ("red", "blue" etc) and hex code
 * @return {BaseColorKey} One of the predefined base colors by Google
 */
export function compressBasecolor({
  baseColor,
  hex,
}: BaseColorHexPair): BaseColorKey {
  const { hcl, sl } = colorData(hex);
  const [, chroma, luminance] = hcl;

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
 * find which base color schema to use based on the provided hex
 */
export function findClosestBaseColor(hex: string): BaseColorHexPair {
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

  return { baseColor, hex };
}

/**
 * Generates a scale of swatches based on the Material scheme. Always generates
 * the scale with the inputted hex at the swatch key "500".
 *
 * Uses the predefined values in `matericalColorScheme` to generate each swatch.
 */
function materialScale(hex: string, baseColor: BaseColorKey) {
  /**
   *  extra notes for whoever wants to know more:
   * uses the values in src/schemas.ts to modify the hue, chroma & lightness
   * values of the inputted hex.
   *
   * ex:
   * when adding materialColorSchema.red.0 to "#f44336" it results in {h: -14,
   * c: 69, l: 95} and so on for all swatches of that base color.
   */
  const hcl = hex2hcl(hex);

  // Some colors have accent colors. some don't. We check for that here.
  const colorKeys =
    materialColorSchema[baseColor].length < COLORKEYS.length
      ? COLORKEYS.slice(0, 9)
      : COLORKEYS;

  const scale = colorKeys.reduce((acc, curr, idx) => {
    const modifiedHCL: number[] = materialColorSchema[baseColor][idx].map(
      (rangeValue, index) => hcl[index] + rangeValue,
    );

    acc[curr as keyof Palette] = hcl2hex(modifiedHCL);

    // 500 does not exist in the COLORKEYS constant so we have to fill it here
    if (curr === "400") {
      acc["500"] = hex;
    }

    return acc;
  }, {} as Palette);

  return scale;
}

type LchDiffSpace = {
  dist: number;
  key: keyof Palette;
  hex: string;
};

/**
 * returns the key, hex and LCH distance of the closest swatch to the inputted
 * hex in the inputted scale
 */
function getLchDifference(hex: string, scale: Palette) {
  const [h, c, l] = hex2hcl(hex);
  const hue: LchDiffSpace = {
    dist: 360,
    key: "50",
    hex,
  };
  const chroma: LchDiffSpace = {
    dist: 150,
    key: "50",
    hex,
  };
  const lightness: LchDiffSpace = {
    dist: 100,
    key: "50",
    hex,
  };

  Object.entries(scale)
    .slice(0, 9)
    .forEach(([scaleKey, scaleHex]: [string, string]) => {
      const hcl = hex2hcl(scaleHex);
      const hueDist = Math.min(Math.abs(hcl[0] - h), 360 + hcl[0] - h);
      const chromaDist = Math.min(Math.abs(hcl[1] - c), 150 + hcl[1] - c);
      const lightnessDist = Math.min(Math.abs(hcl[2] - l), 100 + hcl[2] - l);

      if (hueDist < hue.dist) {
        hue.dist = hueDist;
        hue.key = scaleKey as keyof Palette;
        hue.hex = scaleHex;
      }

      if (chromaDist < chroma.dist) {
        chroma.dist = chromaDist;
        chroma.key = scaleKey as keyof Palette;
        chroma.hex = scaleHex;
      }

      if (lightnessDist < lightness.dist) {
        lightness.dist = lightnessDist;
        lightness.key = scaleKey as keyof Palette;
        lightness.hex = scaleHex;
      }
    });

  return { hue, chroma, lightness };
}

/**
 * Tries to emulate the material palette generators by calculating the distances
 * between hue, chroma and lightness values of the inputted hex and each swatch
 * in all "hand-picked" scales.
 */
function generateFluidScale(baseColorHexPair: BaseColorHexPair) {
  let { hex, baseColor } = baseColorHexPair;
  const hcl = hex2hcl(hex);

  let key: keyof Palette;

  /**
   * compressing should make the end result look better
   */
  baseColor = compressBasecolor({
    baseColor,
    hex,
  } as BaseColorHexPair);

  const new500hex = BASECOLOR.material[baseColor];
  const new500Hcl = hex2hcl(new500hex);
  const newScale = materialScale(new500hex, baseColor);
  const lchDiffs = getLchDifference(hex, newScale);

  /**
   * overwrite key with lightness until I come up with a better approach as it
   * consistently gives the better results.
   */
  key = lchDiffs.lightness.key;

  /**
   * now that we have the "correct" key where our input belongs, we must find the
   * new "500" swatch.
   * To do this we calculate the diff in lch values of our input and the swatch
   * of the original palette which our input will replace.
   *
   * we then apply this diff to the new 500 swatch which we use to generate a
   * new scale.
   */
  const closestHcl = hex2hcl(newScale[key] as string);
  const swatchDiffs = hcl.map((v: number, i: number) => v - closestHcl[i]);

  new500Hcl[0] += swatchDiffs[0];
  new500Hcl[1] += swatchDiffs[1];
  new500Hcl[2] += swatchDiffs[2];

  const finalScale = materialScale(hcl2hex(new500Hcl), baseColor);
  const finalDistances = getLchDifference(hex, finalScale);

  key = finalDistances.lightness.key;

  return {
    scale: finalScale,
    key,
    baseColor,
  };
}

/**
 * The real material palette seems to maintain its scale by changing which
 * swatch the inputted hex value is.
 * This way the material scale is "preserved" and doesn't generate off-putting
 * color palettes.
 */
function fluidScale(baseColorHexPair: BaseColorHexPair) {
  const { hex, baseColor } = baseColorHexPair;
  const { scale: palette, key } = generateFluidScale({
    hex,
    baseColor,
  });

  // if the closest palette key to input hex is 500, just return the normal
  // scale.  It's already the best possible palette for this color.
  if (key === "500") {
    return materialScale(hex, baseColor);
  }

  const keyIndex = COLORKEYS.indexOf(key);

  if (keyIndex < 0) return materialScale(hex, baseColor);

  /**
   * jumping between hex and lch is not 100% accurate. So we trick the users by
   * replacing the swatch of the calculated key with the input.
   */
  palette[key] = hex;

  return palette;
}

/**
 * Generate a scale where the input hex is always key 500
 */
function lockedScale(color: BaseColorHexPair, settings: MaterialSettings) {
  if (settings.algorithm === "auto") {
    const compressedColor = compressBasecolor(color);
    return materialScale(color.hex, compressedColor);
  }

  return materialScale(color.hex, color.baseColor);
}

export function generateMaterialPalette(
  hex: string,
  settings: MaterialSettings,
) {
  try {
    let palette: Palette;
    let color: BaseColorHexPair;

    if (settings.algorithm === "auto") {
      color = findClosestBaseColor(hex);
    } else {
      color = {
        baseColor: settings.algorithm,
        hex,
      };
    }

    if (settings.lockSwatch) {
      palette = lockedScale(color, settings);
    } else {
      palette = fluidScale(color);
    }

    return palette;
  } catch (e) {
    console.error("error: ", e);

    return undefined;
  }
}
