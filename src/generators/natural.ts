import { Palette } from "../types";
import { defaultHCLMods, FULL_COLOR_KEYS } from "../constants";
import { NaturalSettings } from "../store/types/settings";
import { hex2hcl } from "../converters/toHcl";
import { hcl2hex } from "../converters/toHex";
import { findColorName } from "../utils/findColorName";

function createBrighterColors(baseColor: string, settings: NaturalSettings) {
  const LENGTH = 5;
  const [h, c, l] = hex2hcl(baseColor);
  const { customHCLToggled, lighterModifiers } = settings;
  const colorName = findColorName(baseColor);
  const modifier = customHCLToggled
    ? lighterModifiers
    : defaultHCLMods[colorName].lighter;

  let hModHolder = h;
  let cModHolder = c;
  let lModHolder = l;

  return Array.from(new Array(LENGTH), () => {
    hModHolder = hModHolder + modifier.h;
    cModHolder = cModHolder + modifier.c;
    lModHolder = lModHolder + modifier.l;

    const hex = hcl2hex([hModHolder, cModHolder, lModHolder]);

    return hex;
  });
}

function createDarkerColors(baseColor: string, settings: NaturalSettings) {
  const LENGTH = 4;
  const [h, c, l] = hex2hcl(baseColor);
  const { customHCLToggled, darkerModifiers } = settings;
  const colorName = findColorName(baseColor);
  const modifier = customHCLToggled
    ? darkerModifiers
    : defaultHCLMods[colorName].darker;

  let hModHolder = h;
  let cModHolder = c;
  let lModHolder = l;

  return Array.from(new Array(LENGTH), () => {
    hModHolder = hModHolder - modifier.h;
    cModHolder = cModHolder - modifier.c;
    lModHolder = lModHolder - modifier.l;

    const hex = hcl2hex([hModHolder, cModHolder, lModHolder]);

    return hex;
  });
}

export function generateNaturalPalette(
  baseColor: string,
  settings: NaturalSettings
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
