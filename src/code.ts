figma.showUI(__html__)

figma.ui.onmessage = msg => {
  if (msg.type === 'create-palette') {
    const nodes = []
    // const parent = figma.createComponent()
    
    let selectedColor = msg.value;
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

    console.log("brighterColors", brighterColors)
    console.log("darkerColors", darkerColors)
    console.log("completeColorPalette", completeColorPalette)

    for (let i = 0; i < completeColorPalette.length; i++) {
      const rect = figma.createRectangle()

      rect.resize(360, 34);
      rect.y = i * rect.height;

      const fills = clone(rect.fills)
      fills[0].color.r = completeColorPalette[i].rgb.r / 100
      fills[0].color.g = completeColorPalette[i].rgb.g / 100
      fills[0].color.b = completeColorPalette[i].rgb.b / 100

      rect.fills = fills
      
      figma.currentPage.appendChild(rect)
      nodes.push(rect)
    }

    figma.currentPage.selection = nodes
    figma.viewport.scrollAndZoomIntoView(nodes)
  }

  figma.closePlugin()
}

function clone(val) {
  return JSON.parse(JSON.stringify(val))
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
      lModHolder = l + (lDiff * 0.2);
      // hModHolder = h + (h * 0.01) > 360 ? 0 : h + (h * 0.01);
      // hModHolder = h + 1 > 360 ? 0 : h + 1;
    } else {
      const sDiff = maxSaturation - sModHolder;
      const lDiff = maxLightness - lModHolder;

      sModHolder = sModHolder + (sDiff * 0.05);
      lModHolder = lModHolder + (lDiff * 0.2);
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
