import { BASECOLOR, COLORKEYS } from "../constants";
import { materialColorSchema } from "../schemas";
import { hcl2hex } from '../converters/toHex';
import { hex2rgb, hexToRGB } from '../converters/toRgb';
import { hex2hcl, rgb2hcl } from '../converters/toHcl';
import { hexToHSL } from '../converters/toHsl';
import { RgbHslHexObject, BaseColorList } from "../types";
import { isValidHex } from '../utils/validation';

/**
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * @
 * @  ACTUAL MATERIAL PALETTE PART
 * @  https://codepen.io/sebilasse/pen/GQYKJd
 * @
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
export const hexColorReg = /^#?([A-F0-9]{6}|[A-F0-9]{3})$/i;

function specificLight(rgb: number[]) {
  const [r, g, b] = rgb;
  return 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function minmax(value: number, max: number = 100, min: number = 0) {
  return Math.min(max, Math.max(min, value));
}

function minmaxHue(hue: number): number {
  return hue < 0 ? hue + 360 : hue > 360 ? hue - 360 : hue;
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

// Checks if passed hex matches any named colors in the baseColors.
function checkBaseColorName(hex) {
  let baseColors: any = BASECOLOR.material;

  for (let name in baseColors) {
    if (baseColors[name] === hex) {
      return true;
    }
  }

  return false;
}

function palette(hexColor: string) {
  let name: string = "";
  let distance: any = 0;
  let baseColors: any = BASECOLOR.material;

  const hex = `${hexColor}`;
  const hexString = hex.charAt(0) === "#" ? hex : `#${hex}`;

  if (!hex || !isValidHex(hex)) {
    throw new TypeError("Invalid input");
  }

  const { rgb, hcl, sl } = colorData(hex);

  if (checkBaseColorName(hexString)) return { name, hex, sl, distance, baseColors }

  const [h, c, l] = hcl;

  distance = { h: 360, s: 0, l: 0 };
  name = "grey";

  if (sl > 0.9) {
    name = "black";
  } else if (sl < 0.1) {
    name = "white";
    // } else if (c > 8) {
  } else {
    let dist = 360;
    let basecolorName;

    for (basecolorName in baseColors) {
      let [hue, chroma, luminance] = hex2hcl(baseColors[basecolorName]);
      let _dist = Math.min(Math.abs(hue - h), 360 + hue - h);

      if (_dist < dist) {
        dist = _dist;
        name = basecolorName;
        distance = [h - hue, c - chroma, l - luminance];
      }
    }

    const checkBrown = { orange: 1, deepOrange: 1 };
    const checkBlue = {
      indigo: 1,
      blue: 1,
      lightBlue: 1,
      cyan: 1,
      blueGrey: 1
    };

    if (checkBrown.hasOwnProperty(name) && c < 48) {
      name = c < 12 ? "grey" : "brown";
    } else if (checkBlue.hasOwnProperty(name) && c < 32 && sl > 0.32) {
      name = "blueGrey";
    } else if (c < 16) {
      name = "grey";
    }
  }

  // Alternating colors
  const generatedPalette = Object.keys(baseColors).reduce((acc, curr, index) => {
    let [hue, chroma, luminance] = hex2hcl(baseColors[curr]);
    acc[curr] =
      curr === "500"
        ? baseColors[curr]
        : hcl2hex([
          minmaxHue(hue + distance[0]),
          minmax(chroma + distance[1]),
          minmax(luminance + distance[2])
        ]);

    return acc;
  }, {});

  return { name, hex, sl, distance, baseColors: generatedPalette };
}

/**
 * Uses the matericalColorScheme to calculate each hue with HCL
 *
 * ex:
 * basecolor = "red" (#f44336 which in hcl is {h: 14, c: 143, l: 56})
 * materialColorSchema.red.0 = [-28, -74, 39]
 * return = {h: -14, c: 69, l: 95}
 */
function materialScale(
  hex: string,
  name: string,
  baseColors: BaseColorList = BASECOLOR.material
) {
  const { hcl } = colorData(name, baseColors);
  const colorKeys =
    materialColorSchema[name].length < COLORKEYS.length
      ? COLORKEYS.slice(0, 9)
      : COLORKEYS;

  return colorKeys.reduce((acc: object, curr: string, idx: number) => {
    const modifiedHCL: Array<number> = materialColorSchema[name][idx].map(
      (rangeValue, index) => hcl[index] + rangeValue
    );

    acc[curr] = hcl2hex(modifiedHCL);

    if (curr === "400") {
      // Check if hex is custom or part of basecolor
      const checkedHex = baseColors[name] === hex ? baseColors[name] : hex;
      acc["500"] = checkedHex;
    }

    return acc;
  }, {});
}


function generateMaterialHexPalette(hex: string) {
  const paletteObject = palette(hex);
  return materialScale(hex, paletteObject.name, paletteObject.baseColors);
}

export function generateMaterialPalette(baseColor: RgbHslHexObject) {
  try {
    const hexPalette = generateMaterialHexPalette(baseColor.hex);

    return Object.keys(hexPalette).map(key => ({
      rgb: hexToRGB(hexPalette[key], true),
      hsl: hexToHSL(hexPalette[key]),
      hex: hexPalette[key]
    }));
  } catch (e) {
    console.error("[generateMaterialPalette]: material generator is looking for a baseColor property that doesn't exist in the BASECOLOR constant (probably 'black' or 'white'). There is no HCL scale for this color in materialColorSchema.");
    return undefined
  }
}