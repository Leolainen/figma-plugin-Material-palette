figma.showUI(__html__, {
  height: 500
});

figma.ui.onmessage = async msg => {
  if (msg.type === "create-palette") {
    const nodes = [];

    let selectedColor = msg.value;
    const paletteName = msg.name;
    const schema = msg.schema;

    const baseColor = {
      rgb: hexToRGB(selectedColor, true),
      hsl: hexToHSL(selectedColor),
      hex: selectedColor
    };

    const generatePalette = {
      monochrome: () => generateMonochromePalette(baseColor),
      trueMonochrome: () => generateMonochromePalette(baseColor, true),
      material: () => generateMaterialPalette(baseColor)
    };

    const completePalette = generatePalette[schema]();

    await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

    // Create header rectangle
    const headerRect = figma.createRectangle();
    const headerName = figma.createText();
    const headerNumber = figma.createText();
    const headerHex = figma.createText();

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

    const headerRectFills = clone(headerRect.fills);
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

    const headerGroup = figma.group(
      [headerRect, headerName, headerNumber, headerHex],
      figma.currentPage
    );
    nodes.push(headerGroup);

    for (let i = 0; i < completePalette.length; i++) {
      const rect = figma.createRectangle();
      const paletteHex = figma.createText();
      const paletteNumber = figma.createText();

      paletteHex.fontSize = 14;
      paletteNumber.fontSize = 14;

      rect.resize(360, 34);
      rect.y = headerRect.height + i * rect.height;
      paletteHex.x = rect.width - 80;
      paletteHex.y = rect.y + rect.height / 2 - paletteHex.height / 2;
      paletteNumber.x = 20;
      paletteNumber.y = rect.y + rect.height / 2 - paletteNumber.height / 2;

      const fills = clone(rect.fills);
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
      paletteNumber.characters = i > 0 ? (i * 100).toString() : "50";

      const group = figma.group(
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

function generateMonochromePalette(baseColor, trueMonochrome = false) {
  const brighterColors = createBrighterColors(baseColor).reverse();
  const darkerColors = trueMonochrome
    ? createDarkerColors(baseColor, 4, 0)
    : createDarkerColors(baseColor);
  const palette = [...brighterColors, baseColor, ...darkerColors];

  return palette;
}

function generateMaterialPalette(baseColor) {
  const hexPalette = generateMaterialHexPalette(baseColor.hex);

  return Object.keys(hexPalette).map(key => ({
    rgb: hexToRGB(hexPalette[key], true),
    hsl: hexToHSL(hexPalette[key]),
    hex: hexPalette[key]
  }));
}

/**
 *
 * @param {object} text – Figma textNode object
 * @param {string} backgroundColor – CSS Hex color. Ex: #440044
 *
 * returns Figma textNode
 */
function handleTextNodeContrast(text, backgroundColor) {
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

function clone(val) {
  return JSON.parse(JSON.stringify(val));
}

function createBrighterColors(baseColor, length = 5) {
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

function createDarkerColors(baseColor, length = 4, hModMultiplier = 0.02) {
  let sModHolder = 0;
  let lModHolder = 0;
  let hModHolder = 0;

  return Array.from(new Array(length), () => {
    const { h, s, l } = baseColor.hsl;

    if (sModHolder === 0 && lModHolder === 0) {
      sModHolder = s - s * 0.2;
      lModHolder = l - l * 0.15;
      hModHolder = h - (h * hModMultiplier) < 0 ? 360 : h - (h * hModMultiplier);
    } else {
      sModHolder = sModHolder - sModHolder * 0.1;
      lModHolder = lModHolder - lModHolder * 0.15;
      hModHolder =
        hModHolder - (hModHolder * hModMultiplier) < 0
          ? 360
          : hModHolder - (hModHolder * hModMultiplier);
    }

    const hex = HSLToHex(hModHolder, sModHolder, lModHolder);

    return {
      rgb: hexToRGB(hex, true),
      hsl: hexToHSL(hex),
      hex
    };
  });
}

// https://css-tricks.com/converting-color-spaces-in-javascript/
function hexToRGB(H, isPct = false) {
  let r: any = 0,
    g: any = 0,
    b: any = 0;

  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }

  if (isPct) {
    r = +((r / 255) * 100).toFixed(1);
    g = +((g / 255) * 100).toFixed(1);
    b = +((b / 255) * 100).toFixed(1);
  }

  return {
    r,
    g,
    b,
    string:
      "rgb(" +
      (isPct ? r + "%," + g + "%," + b + "%" : +r + "," + +g + "," + +b) +
      ")"
  };
}

function hexToHSL(H) {
  // Convert hex to RGB first
  const RGB = hexToRGB(H);
  let { r, g, b } = RGB;

  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l, string: "hsl(" + h + "," + s + "%," + l + "%)" };
}

function HSLToHex(h, s, l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r: any = 0,
    g: any = 0,
    b: any = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return "#" + r + g + b;
}
/**
 *
 * @param {object} RGB Expects an object of r, g, b
 * ex: {
 *  r: 20,
 *  g: 177,
 *  b: 161
 * }
 */
function RGBToHex(RGB) {
  let { r, g, b } = RGB;
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);

  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return "#" + r + g + b;
}

// Functions picked and adjusted from
// https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/styles/colorManipulator.js
/**
 * The relative brightness of any point in a color space,
 * normalized to 0 for darkest black and 1 for lightest white.
 * @param {string} hex – ex: #F0463C
 */
function getLuminance(hex) {
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
function getContrastRatio(foreground, background) {
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

function hex2rgb(hex) {
  return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
    .exec(hex)
    .slice(1)
    .map(s => parseInt(s, 16));
}

// Hue Chroma Luminance
function hex2hcl(hex) {
  return rgb2hcl(hex2rgb(hex));
}

function specificLight(rgb) {
  const [r, g, b] = rgb;
  return 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function bestTextColor(
  hex,
  lightText = "#ffffff",
  darkText = "#000000",
  average = 0.5
) {
  return specificLight(hex2rgb(hex)) > average ? lightText : darkText;
}

function lab2hcl(lab) {
  const [l, a, b] = lab;
  const c = Math.sqrt(a * a + b * b);
  const h = (Math.atan2(b, a) * (180 / Math.PI) + 360) % 360;
  return [Math.round(c * 10000) === 0 ? 0 : h, c, l];
}

function lab2xyz(lab) {
  const y = (lab[0] + 16) / 116,
    x = lab[1] / 500 + y,
    z = y - lab[2] / 200;
  return [
    [x, 0.95047],
    [y, 1.0],
    [z, 1.08883]
  ].map(a => {
    const v = a[0];
    return a[1] * (v * v * v > 0.008856 ? v * v * v : (v - 16 / 116) / 7.787);
  });
}

function lab2rgb(lab) {
  const [x, y, z] = lab2xyz(lab);
  let r, g, b;
  r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  b = x * 0.0557 + y * -0.204 + z * 1.057;
  return [r, g, b].map(v => {
    v = v > 0.0031308 ? 1.055 * Math.pow(v, 1 / 2.4) - 0.055 : 12.92 * v;
    return Math.max(0, Math.min(1, v)) * 255;
  });
}

function rgb2hex(rgb) {
  const [r, g, b] = rgb;
  const _rgb = (r << 16) | (g << 8) | b;
  return "#" + ("000000" + _rgb.toString(16)).slice(-6);
}

function rgb2xyz(rgb) {
  const rgbXYZ = v =>
    (v /= 255) <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  const xyzLAB = v =>
    v > 0.008856452 ? Math.pow(v, 1 / 3) : v / 0.12841855 + 0.137931034;
  const [r, g, b] = rgb.map(rgbXYZ);
  return [
    xyzLAB((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047),
    xyzLAB(0.2126729 * r + 0.7151522 * g + 0.072175 * b),
    xyzLAB((0.0193339 * r + 0.119192 * g + 0.9503041 * b) / 1.08883)
  ];
}

function rgb2lab(rgb) {
  const [r, g, b] = rgb;
  const [x, y, z] = rgb2xyz(rgb);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

function rgb2hcl(rgb) {
  return lab2hcl(rgb2lab(rgb));
}

function hcl2lab(hcl) {
  let [h, c, l] = hcl;
  h = h * (Math.PI / 180);
  return [l, Math.cos(h) * c, Math.sin(h) * c];
}

function hcl2rgb(hcl) {
  return lab2rgb(hcl2lab(hcl));
}

function hcl2hex(hcl) {
  return rgb2hex(hcl2rgb(hcl));
}

/**
 * Material algorithm
 * Kudos to Sebastian Lasse
 * https://codepen.io/sebilasse/pen/GQYKJd
 */
const COLORKEYS = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "600",
  "700",
  "800",
  "900",
  "a100",
  "a200",
  "a400",
  "a700"
];

const BASECOLOR = {
  /* should have l*sl 15 - 35 */
  material: {
    red: "#f44336",
    deepOrange: "#ff5722",
    orange: "#ff9800",
    amber: "#ffc107",
    yellow: "#ffeb3b",
    lime: "#cddc39",
    lightGreen: "#8bc34a",
    green: "#4caf50",
    teal: "#009688",
    cyan: "#00bcd4",
    lightBlue: "#03a9f4",
    blue: "#2196f3",
    indigo: "#3f51b5",
    deepPurple: "#673ab7",
    purple: "#9c27b0",
    pink: "#e91e63",
    brown: "#795548",
    grey: "#9e9e9e",
    blueGrey: "#607d8b"
  }
};

// Every index has an array of 3 values
// These 3 values represent the [hue, chroma, luminance] values applied to
// the chosen base color.
const materialColorScheme = {
  red: [
    [-28, -74, 39],
    [-23, -63, 31],
    [-13, -47, 16],
    [-11, -33, 6],
    [-5, -12, 2],
    [-2, -4, -4],
    [-3, -7, -9],
    [-2, -9, -12],
    [0, -9, -16],
    [-5, -31, 15],
    [-6, -6, 4],
    [-10, 7, -1],
    [4, 10, -11]
  ],
  pink: [
    [343, -67, 42],
    [344, -51, 31],
    [347, -34, 20],
    [-10, -17, 10],
    [-6, -7, 4],
    [-2, -4, -4],
    [-5, -10, -8],
    [-9, -15, -13],
    [343, -24, -21],
    [348, -24, 18],
    [-5, -1, 8],
    [5, 7, 1],
    [-8, -8, -8]
  ],
  purple: [
    [-2, -70, 52],
    [-2, -55, 40],
    [-1, -37, 28],
    [-1, -20, 16],
    [0, -8, 7],
    [-2, -1, -3],
    [-5, -3, -7],
    [-7, -4, -11],
    [-12, -7, -17],
    [0, -6, 29],
    [0, 23, 18],
    [-1, 35, 12],
    [-7, 41, 6]
  ],
  deepPurple: [
    [-3, -68, 56],
    [-4, -55, 45],
    [-3, -41, 32],
    [-2, -24, 19],
    [-1, -12, 9],
    [-1, 0, -2],
    [-1, 0, -6],
    [-2, 0, -9],
    [-3, 0, -15],
    [-1, -9, 29],
    [-2, 26, 11],
    [0, 47, 3],
    [1, 43, -2]
  ],
  indigo: [
    [-11, -55, 55],
    [-9, -44, 44],
    [-8, -33, 31],
    [-6, -22, 19],
    [-3, -11, 9],
    [1, 0, -3],
    [2, -1, -7],
    [3, -1, -11],
    [6, 0, -19],
    [-5, -7, 29],
    [1, 22, 13],
    [3, 35, 8],
    [5, 42, 5]
  ],
  blue: [
    [-24, -48, 34],
    [-18, -37, 26],
    [-15, -25, 19],
    [-11, -15, 11],
    [-5, -7, 5],
    [3, 0, -5],
    [7, 0, -11],
    [10, 0, -17],
    [17, 2, -28],
    [5, -11, 11],
    [13, 12, -2],
    [17, 22, -7],
    [23, 36, -13]
  ],
  lightBlue: [
    [-25, -40, 30],
    [-22, -29, 23],
    [-19, -18, 15],
    [-14, -9, 9],
    [-7, -4, 4],
    [3, -1, -5],
    [7, -2, -11],
    [10, -4, -18],
    [18, -5, -29],
    [-19, -17, 17],
    [-11, -6, 9],
    [0, 2, 3],
    [12, 5, -7]
  ],
  cyan: [
    [-7, -30, 26],
    [-8, -20, 20],
    [-7, -10, 13],
    [-5, -3, 7],
    [-4, 0, 3],
    [-1, -2, -6],
    [-4, -6, -13],
    [-6, -9, -20],
    [-15, -14, -33],
    [-20, -2, 23],
    [-21, 11, 21],
    [-2, 6, 14],
    [4, 0, -1]
  ],
  teal: [
    [11, -30, 39],
    [7, -21, 30],
    [6, -12, 21],
    [4, -4, 12],
    [2, 0, 6],
    [-1, -2, -5],
    [-3, -5, -10],
    [-3, -7, -16],
    [-8, -12, -27],
    [-6, -6, 39],
    [-10, 13, 36],
    [-15, 22, 27],
    [-6, 9, 14]
  ],
  green: [
    [6, -55, 31],
    [4, -44, 25],
    [3, -32, 17],
    [2, -18, 10],
    [1, -9, 5],
    [0, -3, -5],
    [0, -7, -12],
    [0, -10, -18],
    [0, -18, -29],
    [11, -31, 28],
    [17, -7, 22],
    [9, 19, 17],
    [4, 18, 7]
  ],
  lightGreen: [
    [3, -57, 24],
    [2, -45, 19],
    [2, -33, 13],
    [1, -19, 8],
    [0, -9, 4],
    [1, -3, -6],
    [2, -7, -13],
    [4, -11, -20],
    [8, -17, -33],
    [0, -7, 22],
    [0, 19, 20],
    [5, 45, 17],
    [5, 32, 6]
  ],
  lime: [
    [5, -67, 14],
    [3, -52, 11],
    [3, -35, 8],
    [2, -20, 5],
    [1, -9, 2],
    [-1, -5, -6],
    [-3, -10, -13],
    [-5, -17, -21],
    [-11, -27, -35],
    [1, -15, 13],
    [0, 10, 12],
    [8, 23, 9],
    [9, 18, 2]
  ],
  yellow: [
    [8, -70, 7],
    [6, -55, 5],
    [4, -37, 3],
    [2, -21, 2],
    [1, -9, 1],
    [-6, -3, -5],
    [-14, -6, -11],
    [-23, -7, -17],
    [-38, -3, -27],
    [8, -25, 6],
    [5, 15, 5],
    [0, 10, 0],
    [-7, 5, -5]
  ],
  amber: [
    [13, -71, 16],
    [10, -53, 12],
    [8, -34, 8],
    [6, -14, 5],
    [3, -4, 2],
    [-5, 0, -3],
    [-12, -1, -8],
    [-18, 0, -11],
    [-29, 5, -18],
    [11, -31, 10],
    [7, -9, 6],
    [1, 1, 1],
    [-8, -1, -5]
  ],
  orange: [
    [17, -72, 24],
    [13, -56, 19],
    [10, -38, 13],
    [7, -19, 7],
    [4, -7, 3],
    [-3, 0, -3],
    [-8, 0, -7],
    [-12, 0, -11],
    [-19, 2, -17],
    [14, -36, 14],
    [3, -15, 4],
    [-3, 1, -2],
    [-14, 6, -9]
  ],
  deepOrange: [
    [-16, -81, 34],
    [-2, -65, 26],
    [-2, -49, 17],
    [-1, -30, 10],
    [-1, -14, 4],
    [0, -2, -3],
    [0, -5, -6],
    [0, -8, -10],
    [0, -13, -16],
    [-2, -42, 14],
    [0, -13, 4],
    [-1, 11, -3],
    [-2, 2, -12]
  ],
  brown: [
    [10, -17, 54],
    [1, -14, 43],
    [-1, -11, 31],
    [0, -7, 19],
    [0, -4, 10],
    [-2, -2, -4],
    [-3, -3, -10],
    [-8, -5, -15],
    [-11, -6, -21]
  ],
  blueGrey: [
    [6, -11, 44],
    [-5, -9, 35],
    [-1, -7, 25],
    [-1, -4, 15],
    [0, -2, 8],
    [-1, -1, -6],
    [-1, -3, -14],
    [1, -5, -22],
    [1, -7, -31]
  ],
  grey: [
    [0, 0, 33],
    [0, 0, 31],
    [0, 0, 29],
    [0, 0, 24],
    [0, 0, 11],
    [0, 0, -16],
    [0, 0, -24],
    [0, 0, -37],
    [0, 0, -52]
  ]
};

function minmax(value, max = 100, min = 0) {
  return Math.min(max, Math.max(min, value));
}

function minmaxHue(hue) {
  return hue < 0 ? hue + 360 : hue > 360 ? hue - 360 : hue;
}

function colorData(hex, palette = undefined) {
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

function palette(hexColor) {
  let name: any = "";
  let distance: any = 0;
  let palette: any = BASECOLOR.material;

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

    for (basecolorName in BASECOLOR.material) {
      let [hue, chroma, luminance] = hex2hcl(BASECOLOR.material[basecolorName]);
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
  palette = Object.keys(BASECOLOR.material).reduce((acc, curr) => {
    let [hue, chroma, luminance] = hex2hcl(BASECOLOR.material[curr]);
    acc[curr] =
      curr === "500"
        ? BASECOLOR.material[curr]
        : hcl2hex([
          minmaxHue(hue + distance[0]),
          minmax(chroma + distance[1]),
          minmax(luminance + distance[2])
        ]);

    return acc;
  }, {});

  return { name, hex, sl, distance, palette };
}

/**
 * Uses the matericalColorScheme to calculte each hue with HCL
 *
 * ex:
 * basecolor = "red" (#f44336 which in hcl is {h: 14, c: 143, l: 56})
 * materialColorScheme.red.0 = [-28, -74, 39]
 * return = {h: -14, c: 69, l: 95}
 */
function materialScale(name, palette = BASECOLOR.material) {
  const { hcl, sl } = colorData(name, palette);
  const colorKeys =
    materialColorScheme[name].length < COLORKEYS.length
      ? COLORKEYS.slice(0, 9)
      : COLORKEYS;

  return colorKeys.reduce((acc, curr, idx) => {
    const modifiedHCL = materialColorScheme[name][idx].map(
      (rangeValue, index) => hcl[index] + rangeValue
    );

    acc[curr] = hcl2hex(modifiedHCL);

    if (curr === "400") {
      acc["500"] = palette[name];
    }

    return acc;
  }, {});
}

function generateMaterialHexPalette(hex) {
  const paletteObject = palette(hex);
  return materialScale(paletteObject.name, paletteObject.palette);
}
