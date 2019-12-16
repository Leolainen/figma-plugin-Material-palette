figma.showUI(__html__, {
  height: 300
})

figma.ui.onmessage = async msg => {
  if (msg.type === 'create-palette') {
    const nodes = []
    
    let selectedColor = msg.value;
    const paletteName = msg.name;

    const baseColor = {
      rgb: hexToRGB(selectedColor, true),
      hsl: hexToHSL(selectedColor),
      hex: selectedColor,
    }
    const brighterColors = createBrighterColors(baseColor).reverse();
    const darkerColors = createDarkerColors(baseColor);
    const completeColorPalette = [
      ...brighterColors,
      baseColor,
      ...darkerColors,
    ];

    await figma.loadFontAsync({ family: "Roboto", style: "Regular" })

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

    const headerGroup = figma.group([headerRect, headerName, headerNumber, headerHex], figma.currentPage);
    nodes.push(headerGroup);

    for (let i = 0; i < completeColorPalette.length; i++) {
      const rect = figma.createRectangle()
      const paletteHex = figma.createText();
      const paletteNumber = figma.createText();

      paletteHex.fontSize = 14;
      paletteNumber.fontSize = 14;
      
      rect.resize(360, 34);
      rect.y = headerRect.height + (i * rect.height);
      paletteHex.x = rect.width - 80;
      paletteHex.y = rect.y + (rect.height / 2) - (paletteHex.height / 2);
      paletteNumber.x = 20;
      paletteNumber.y = rect.y + (rect.height / 2) - (paletteNumber.height / 2);

      const fills = clone(rect.fills);
      fills[0].color.r = completeColorPalette[i].rgb.r / 100;
      fills[0].color.g = completeColorPalette[i].rgb.g / 100;
      fills[0].color.b = completeColorPalette[i].rgb.b / 100;

      // Get contrast ratio to set paletteHex color
      paletteHex.fills = handleTextNodeContrast(paletteHex, completeColorPalette[i].hex);
      paletteNumber.fills = handleTextNodeContrast(paletteHex, completeColorPalette[i].hex);
      rect.fills = fills
      
      paletteHex.characters = completeColorPalette[i].hex.toUpperCase();
      paletteNumber.characters = i > 0 ? (i * 100).toString() : "50"

      const group = figma.group([rect, paletteHex, paletteNumber], figma.currentPage);
      nodes.push(group)
    }

    figma.group([...nodes], figma.currentPage);
    figma.currentPage.selection = nodes
    figma.viewport.scrollAndZoomIntoView(nodes)
  }

  figma.closePlugin()
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
  // let hModHolder = 0;

  return Array.from(new Array(length), () => {
    const { h, s, l } = baseColor.hsl;

    if (sModHolder === 0 && lModHolder === 0) {
      const sDiff = maxSaturation - s;
      const lDiff = maxLightness - l;

      sModHolder = s + (sDiff * 0.05);
      lModHolder = l + (lDiff * 0.25);
      // hModHolder = h + (h * 0.01) > 360 ? 0 : h + (h * 0.01);
      // hModHolder = h + 1 > 360 ? 0 : h + 1;
    } else {
      const sDiff = maxSaturation - sModHolder;
      const lDiff = maxLightness - lModHolder;

      sModHolder = sModHolder + (sDiff * 0.05);
      lModHolder = lModHolder + (lDiff * 0.25);
      // hModHolder = hModHolder + (hModHolder * 0.01) > 360 ? 0 : hModHolder + (hModHolder * 0.01)
      // hModHolder = hModHolder + 1 > 360 ? 0 : hModHolder + 1
    }

    // const hMod = h + h * 0.01;

    const hex = HSLToHex(h, s, lModHolder);
    // const hex = HSLToHex(h, sModHolder, lModHolder);
    // const hex = HSLToHex(hModHolder, sModHolder, lModHolder);

    return {
      rgb: hexToRGB(hex, true),
      hsl: hexToHSL(hex),
      hex,
    }
  });
}

function createDarkerColors(baseColor, length = 4) {
  let sModHolder = 0;
  let lModHolder = 0;
  let hModHolder = 0;

  return Array.from(new Array(length), () => {
    const { h, s, l } = baseColor.hsl;

    if (sModHolder === 0 && lModHolder === 0) {
      sModHolder = s - (s * 0.2);
      lModHolder = l - (l * 0.15);
      hModHolder = h - (h * 0.02) < 0 ? 360 : h - (h * 0.02);
      // hModHolder = h - 1 < 0 ? 360 : h - 1;
    } else {
      sModHolder = sModHolder - (sModHolder * 0.1);
      // sModHolder = sModHolder - (sModHolder * 0.15);
      // lModHolder = lModHolder - (lModHolder * 0.1);
      lModHolder = lModHolder - (lModHolder * 0.15);
      hModHolder = hModHolder - (hModHolder * 0.02) < 0 ? 360 : hModHolder - (hModHolder * 0.02);
      // hModHolder = hModHolder - 1 < 0 ? 360 : hModHolder - 1;
    }

    // const hMod = h - 1;
    // const hMod = h - h * 0.01;

    const hex = HSLToHex(hModHolder, sModHolder, lModHolder);

    return {
      rgb: hexToRGB(hex, true),
      hsl: hexToHSL(hex),
      hex,
    }
  });
}

// https://css-tricks.com/converting-color-spaces-in-javascript/
function hexToRGB(H, isPct = false) {
  let r: any = 0, g: any = 0, b: any = 0;

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
    r = +(r / 255 * 100).toFixed(1);
    g = +(g / 255 * 100).toFixed(1);
    b = +(b / 255 * 100).toFixed(1);
  }
  
  return {r, g, b, string: "rgb(" + (isPct ? r + "%," + g + "%," + b + "%" : + r + "," + +g + "," + +b) + ")" };
}

function hexToHSL(H) {
  // Convert hex to RGB first
  const RGB = hexToRGB(H);
  let { r, g, b } = RGB;

  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

  if (delta == 0)
    h = 0;
  else if (cmax == r)
    h = ((g - b) / delta) % 6;
  else if (cmax == g)
    h = (b - r) / delta + 2;
  else
    h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0)
    h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l, string: "hsl(" + h + "," + s + "%," + l + "%)" }
}

function HSLToHex(h,s,l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r: any = 0,
      g: any = 0,
      b: any = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

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
  let {r, g, b} = RGB;
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);

  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

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
  return Number((0.2126 * rgbVal[0] + 0.7152 * rgbVal[1] + 0.0722 * rgbVal[2]).toFixed(3));
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