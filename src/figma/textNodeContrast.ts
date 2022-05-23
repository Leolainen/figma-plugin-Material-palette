import { getContrastRatio } from "../utils/contrast";
import { rgbToHex } from "../converters/toHex";
import clone from "../utils/clone";

/**
 * default TextNode.fills text color is black
 * this function turns it white if the contrast between text and background
 * is too low.
 *
 * @param {TextNode} text – Figma textNode object
 * @param {string} backgroundColor – CSS Hex color. Ex: #440044
 * @returns {symbol} used by figma TextNodes
 */
export function textNodeContrast(
  text: TextNode,
  backgroundColor: string
): typeof text.fills {
  // @ts-expect-error - issues with type definition
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

export default textNodeContrast;
