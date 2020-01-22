import { BASECOLOR, COLORKEYS } from "./constants";
import { materialColorSchema } from "./schemas";
import {
  hcl2hex,
  hex2rgb,
  hex2hcl,
  rgb2hcl,
  hexToRGB,
  hexToHSL,
  HSLToHex,
  RGBToHex
} from "./converters";
import { RgbHslHexObject, BaseColorList } from "./types";

figma.showUI(__html__, {
  height: 500
});

figma.ui.onmessage = async msg => {
  if (msg.type === "create-palette") {
    const nodes: SceneNode[] = [];

    let selectedColor: string = msg.value[0] === "#" ? msg.value : `#${msg.value}`;
    const paletteName: string = msg.name;
    const schema: string = msg.schema;

    const baseColor: RgbHslHexObject = {
      rgb: hexToRGB(selectedColor, true),
      hsl: hexToHSL(selectedColor),
      hex: selectedColor
    };

    const generatePalette: {
      monochrome: Function;
      trueMonochrome: Function;
      material: Function;
    } = {
      monochrome: () => generateMonochromePalette(baseColor),
      trueMonochrome: () => generateMonochromePalette(baseColor, true),
      material: () => generateMaterialPalette(baseColor)
    };

    const completePalette: RgbHslHexObject[] = generatePalette[schema]();

    await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

    // Create header rectangle
    const headerRect: RectangleNode = figma.createRectangle();
    const headerName: TextNode = figma.createText();
    const headerNumber: TextNode = figma.createText();
    const headerHex: TextNode = figma.createText();

    headerRect.resize(360, 122);

    headerName.fontSize = 14;
    headerName.x = 20;
    headerName.y = 20;
    headerNumber.fontSize = 14;
    headerNumber.x = 20;
    headerNumber.y = headerRect.height - 30;
    headerHex.fontSize = 14;
    headerHex.x = headerRect.width - 80;
    headerHex.y = headerRect.height - 30;

    const headerRectFills: symbol = clone(headerRect.fills);
    headerRectFills[0].color.r = baseColor.rgb.r / 100;
    headerRectFills[0].color.g = baseColor.rgb.g / 100;
    headerRectFills[0].color.b = baseColor.rgb.b / 100;

    headerRect.fills = headerRectFills;
    headerName.fills = handleTextNodeContrast(headerName, baseColor.hex);
    headerNumber.fills = handleTextNodeContrast(headerNumber, baseColor.hex);
    headerHex.fills = handleTextNodeContrast(headerHex, baseColor.hex);

    headerName.characters = paletteName;
    headerNumber.characters = "500";
    headerHex.characters = baseColor.hex.toUpperCase();

    const headerGroup: FrameNode = figma.group(
      [headerRect, headerName, headerNumber, headerHex],
      figma.currentPage
    );
    nodes.push(headerGroup);

    for (let i = 0; i < completePalette.length; i++) {
      const rect: RectangleNode = figma.createRectangle();
      const paletteHex: TextNode = figma.createText();
      const paletteNumber: TextNode = figma.createText();

      paletteHex.fontSize = 14;
      paletteNumber.fontSize = 14;

      rect.resize(360, 34);
      rect.y = headerRect.height + i * rect.height;
      paletteHex.x = rect.width - 80;
      paletteHex.y = rect.y + rect.height / 2 - paletteHex.height / 2;
      paletteNumber.x = 20;
      paletteNumber.y = rect.y + rect.height / 2 - paletteNumber.height / 2;

      const fills: symbol = clone(rect.fills);
      fills[0].color.r = completePalette[i].rgb.r / 100;
      fills[0].color.g = completePalette[i].rgb.g / 100;
      fills[0].color.b = completePalette[i].rgb.b / 100;

      // Get contrast ratio to set paletteHex color
      paletteHex.fills = handleTextNodeContrast(
        paletteHex,
        completePalette[i].hex
      );
      paletteNumber.fills = handleTextNodeContrast(
        paletteHex,
        completePalette[i].hex
      );
      rect.fills = fills;

      paletteHex.characters = completePalette[i].hex.toUpperCase();
      if (i > 0 && i <= 9) {
        paletteNumber.characters = (i * 100).toString();
      } else if (i > 9) {
        switch (i) {
          case 10:
            paletteNumber.characters = "A100";
            break;
          case 11:
            paletteNumber.characters = "A200";
            break;
          case 12:
            paletteNumber.characters = "A400";
            break;
          case 13:
            paletteNumber.characters = "A700";
            break;
          default:
            paletteNumber.characters = (i * 100).toString();
        }
      } else {
        paletteNumber.characters = "50";
      }

      const group: FrameNode = figma.group(
        [rect, paletteHex, paletteNumber],
        figma.currentPage
      );
      nodes.push(group);
    }

    figma.group([...nodes], figma.currentPage);
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  figma.closePlugin();
};

function generateMonochromePalette(
  baseColor: RgbHslHexObject,
  trueMonochrome: Boolean = false
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
    ...darkerColors
  ];

  return palette;
}

function generateMaterialPalette(baseColor: RgbHslHexObject) {
  const hexPalette = generateMaterialHexPalette(baseColor.hex);

  return Object.keys(hexPalette).map(key => ({
    rgb: hexToRGB(hexPalette[key], true),
    hsl: hexToHSL(hexPalette[key]),
    hex: hexPalette[key]
  }));
}

/**
 *
 * @param {TextNode} text – Figma textNode object
 * @param {string} backgroundColor – CSS Hex color. Ex: #440044
 *
 * returns typeof symbol
 */
function handleTextNodeContrast(text: TextNode, backgroundColor: string) {
  // Get contrast ratio to set text color
  const textRGB = text.fills[0].color;
  const textHex = RGBToHex(textRGB);
  const contrastRatio = getContrastRatio(textHex, backgroundColor);
  const textFills = clone(text.fills);

  // Sets text color if contrast is too low
  if (contrastRatio < 6) {
    textFills[0].color.r = 1;
    textFills[0].color.g = 1;
    textFills[0].color.b = 1;
  }

  return textFills;
}

function clone(val: any) {
  return JSON.parse(JSON.stringify(val));
}

function createBrighterColors(baseColor: RgbHslHexObject, length: number = 5) {
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

      sModHolder = sModHolder + sDiff * 0.05;
      lModHolder = lModHolder + lDiff * 0.25;
    }

    const hex = HSLToHex(h, s, lModHolder);

    return {
      rgb: hexToRGB(hex, true),
      hsl: hexToHSL(hex),
      hex
    };
  });
}

function createDarkerColors(
  baseColor: RgbHslHexObject,
  length: number = 4,
  hModMultiplier: number = 0.02
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
      sModHolder = sModHolder - sModHolder * 0.1;
      lModHolder = lModHolder - lModHolder * 0.15;
      hModHolder =
        hModHolder - hModHolder * hModMultiplier < 0
          ? 360
          : hModHolder - hModHolder * hModMultiplier;
    }

    const hex = HSLToHex(hModHolder, sModHolder, lModHolder);

    return {
      rgb: hexToRGB(hex, true),
      hsl: hexToHSL(hex),
      hex
    };
  });
}

// Functions picked and adjusted from
// https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/styles/colorManipulator.js
/**
 * The relative brightness of any point in a color space,
 * normalized to 0 for darkest black and 1 for lightest white.
 * @param {string} hex – ex: #F0463C
 */
function getLuminance(hex: string) {
  const rgb = hexToRGB(hex);

  const rgbVal = [rgb.r, rgb.g, rgb.b].map(val => {
    val /= 255; // normalized
    return val <= 0.03928 ? val / 12.92 : ((val + 0.055) / 1.055) ** 2.4;
  });

  // Truncate at 3 digits
  return Number(
    (0.2126 * rgbVal[0] + 0.7152 * rgbVal[1] + 0.0722 * rgbVal[2]).toFixed(3)
  );
}

/**
 * Calculates the contrast ratio between two colors.
 * Formula: https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
 *
 * @param {string} foreground - ex: #F0463C
 * @param {string} background - ex: #212126
 * @returns {number} A contrast ratio value in the range 0 - 21.
 */
function getContrastRatio(foreground: string, background: string) {
  const lumA = getLuminance(foreground);
  const lumB = getLuminance(background);
  return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);
}

/**
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * @
 * @  ACTUAL MATERIAL PALETTE PART
 * @  https://codepen.io/sebilasse/pen/GQYKJd
 * @
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
const hexColorReg = /^#?([A-F0-9]{6}|[A-F0-9]{3})$/i;

function specificLight(rgb: number[]) {
  const [r, g, b] = rgb;
  return 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function minmax(value: number, max: number = 100, min: number = 0) {
  return Math.min(max, Math.max(min, value));
}

function minmaxHue(hue: number) {
  return hue < 0 ? hue + 360 : hue > 360 ? hue - 360 : hue;
}

function colorData(hex: string, palette: any = undefined) {
  const rgb = hex2rgb(!palette ? hex : palette[hex]);

  const hcl = rgb2hcl(rgb);
  const colorData = { rgb, hcl, sl: specificLight(rgb) };
  const SL = hcl[2] * colorData.sl;

  if (SL < 12) {
    console.warn(`${hex} is too light: ${SL} / min. 12`);
  } else if (SL > 36) {
    console.warn(`${hex} is too dark: ${SL} / max. 36`);
  }

  return colorData;
}

function palette(hexColor: string) {
  let name: string = "";
  let distance: any = 0;
  let palette: any = BASECOLOR.material;
  // let palette: BaseColorList = BASECOLOR.material;

  const hex = `${hexColor}`;
  const hexString = hex.charAt(0) === "#" ? hex : `#${hex}`;

  if (!hex || !hexColorReg.test(hex)) {
    throw new TypeError("Invalid input");
  }

  const { rgb, hcl, sl } = colorData(hex);

  // If a used input is "red" or "orange" instead of a hex
  for (name in palette) {
    if (palette[name] === hexString) {
      return { name, hex, sl, distance, palette };
    }
  }

  const [h, c, l] = hcl;
  distance = { h: 360, s: 0, l: 0 };

  // Color name
  name = "grey";

  if (sl > 0.9) {
    name = "black";
  } else if (sl < 0.1) {
    name = "white";
  } else if (c > 8) {
    let dist = 360;
    let basecolorName;

    for (basecolorName in palette) {
      let [hue, chroma, luminance] = hex2hcl(palette[basecolorName]);
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
  const generatedPalette = Object.keys(palette).reduce((acc, curr) => {
    let [hue, chroma, luminance] = hex2hcl(palette[curr]);
    acc[curr] =
      curr === "500"
        ? palette[curr]
        : hcl2hex([
          minmaxHue(hue + distance[0]),
          minmax(chroma + distance[1]),
          minmax(luminance + distance[2])
        ]);

    return acc;
  }, {});

  return { name, hex, sl, distance, palette: generatedPalette };
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
  name: string,
  palette: BaseColorList = BASECOLOR.material
) {
  const { hcl, sl } = colorData(name, palette);
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
      acc["500"] = palette[name];
    }

    return acc;
  }, {});
}

function generateMaterialHexPalette(hex: string) {
  const paletteObject = palette(hex);
  return materialScale(paletteObject.name, paletteObject.palette);
}
