import { COLORKEYS } from "./constants";
import {
  HSLToHex,
  RGBToHex
} from './converters/toHex';
import {
  hexToRGB
} from './converters/toRgb';
import { hexToHSL } from './converters/toHsl';
import clone from './utils/clone';
import { RgbHslHexObject, BaseColorList } from "./types";
import { generateMaterialPalette } from './generators/material/index';

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

    headerName.characters = paletteName.toUpperCase();
    headerNumber.characters = "500";
    headerHex.characters = baseColor.hex.toUpperCase();
    headerRect.name = `${headerName.characters} - ${headerHex.characters} - ${headerNumber.characters}`

    const headerGroup: FrameNode = figma.group(
      [headerRect, headerName, headerNumber, headerHex],
      figma.currentPage
    );
    headerGroup.name = `${paletteName} Header`
    headerGroup.locked = true;
    nodes.push(headerGroup);

    const fullColorKeys = COLORKEYS;
    fullColorKeys.splice(5, 0, "500")

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
      paletteNumber.characters = fullColorKeys[i];

      rect.name = `${paletteNumber.characters} ${completePalette[i].hex}`;

      const group: FrameNode = figma.group(
        [rect, paletteHex, paletteNumber],
        figma.currentPage
      );
      group.name = paletteNumber.characters;
      group.locked = true;

      nodes.push(group);
    }

    const parentFrame = figma.createFrame();
    parentFrame.name = paletteName;
    parentFrame.clipsContent = false;

    // Appends all nodes into wrapping frame
    nodes.forEach(node => parentFrame.appendChild(node));

    // Resize frame to children width & height
    parentFrame.resize(
      nodes[0].width,
      nodes.reduce((acc, curr) => curr.height + acc, 0)
    )

    figma.currentPage.appendChild(parentFrame);
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
