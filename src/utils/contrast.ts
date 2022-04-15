import { hexToRGB } from "../converters/toRgb";

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

// returns #fff or #000 depending on contrast value
export const handleTextContrast = (hex: string): string =>
  getContrastRatio("#ffffff", hex) < 6 ? "#000" : "#fff";
