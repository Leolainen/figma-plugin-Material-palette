import { rgbToHex } from "../converters/toHex";
import { hexToRGB } from "../converters/toRgb";
import clone from "./clone";

// Functions picked and adjusted from
// https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/styles/colorManipulator.js
/**
 * The relative brightness of any point in a color space,
 * normalized to 0 for darkest black and 1 for lightest white.
 * @param {string} hex – ex: #F0463C
 * @returns {number} luminance value truncated at 3 digits
 */
export function getLuminance(hex: string): number {
  const rgb = hexToRGB(hex);

  const rgbVal = [rgb.r, rgb.g, rgb.b].map((val) => {
    const valNormalized = val / 255; // normalized
    return valNormalized <= 0.03928
      ? valNormalized / 12.92
      : ((valNormalized + 0.055) / 1.055) ** 2.4;
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
 * divides highest luminance value with lowest.
 *
 * @param {string} foreground - ex: #F0463C
 * @param {string} background - ex: #212126
 * @returns {number} A contrast ratio value in the range 0 - 21.
 */
export function getContrastRatio(
  foreground: string,
  background: string
): number {
  const lumA = getLuminance(foreground);
  const lumB = getLuminance(background);
  return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);
}

/**
 * default TextNode.fills text color is black
 * this function turns it white if the contrast between text and background
 * is too low.
 *
 * @param {TextNode} text – Figma textNode object
 * @param {string} backgroundColor – CSS Hex color. Ex: #440044
 * @returns {symbol} used by figma TextNodes
 */
export function handleTextNodeContrast(
  text: TextNode,
  backgroundColor: string
): symbol {
  // @ts-ignore - incorrect typing in figma? `fills` should be ReadonlyArray<Paint> | symbol
  const textRGB = text.fills[0].color; // Get contrast ratio to set text color
  const textHex = rgbToHex(textRGB);
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

// returns #fff or #000 depending on contrast value
export const handleTextContrast = (hex: string): string =>
  getContrastRatio("#ffffff", hex) < 6 ? "#000" : "#fff";
