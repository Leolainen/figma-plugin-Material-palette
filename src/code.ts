import { COLORKEYS, DEFAULT_BASE_COLOR } from "./constants";
import clone from "./utils/clone";
import { getContrastRatio } from "./utils/contrast";
import { RgbHslHexObject } from "./types";
import { rgbToHex } from "./converters/toHex";

const fullColorKeys = COLORKEYS;
fullColorKeys.splice(5, 0, "500"); // include 500 swatch that's missing in the COLORKEYS

type PaintNodeProps = {
  node: RectangleNode;
  rgb: [number, number, number];
};

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

const paintNode = (paintNodeProps: PaintNodeProps) => {
  const {
    node,
    rgb: [r, g, b],
  } = paintNodeProps;

  const fills = clone(node.fills);
  fills[0].color.r = r / 100;
  fills[0].color.g = g / 100;
  fills[0].color.b = b / 100;

  return fills;
};

figma.showUI(__html__, {
  height: 650,
  width: 890,
});

figma.ui.postMessage({
  lastSelectedColor:
    figma.root.getPluginData("lastSelectedColor") || DEFAULT_BASE_COLOR,
});

const createPaletteBar = (paletteBarProps: PaletteBarProps) => {
  const {
    size: { width, height },
    position: { y },
    fontSize,
    color: { rgb, hex },
    swatchIndex,
  } = paletteBarProps;
  const rect = figma.createRectangle();
  const paletteHex: TextNode = figma.createText();
  const paletteNumber: TextNode = figma.createText();

  paletteHex.fontSize = fontSize;
  paletteNumber.fontSize = fontSize;

  rect.resize(360, height);
  rect.y = y;
  paletteHex.x = width - 80;
  paletteHex.y = y + height / 2 - paletteHex.height / 2;
  paletteNumber.x = 20;
  paletteNumber.y = y + height / 2 - paletteNumber.height / 2;

  // Get contrast ratio to set paletteHex color
  paletteHex.fills = handleTextNodeContrast(paletteHex, hex);
  paletteNumber.fills = handleTextNodeContrast(paletteHex, hex);
  rect.fills = paintNode({
    node: rect,
    rgb: [rgb.r, rgb.g, rgb.b],
  });

  paletteHex.characters = hex.toUpperCase();
  paletteNumber.characters = fullColorKeys[swatchIndex];

  rect.name = `${paletteNumber.characters} ${hex}`;

  const group = figma.group(
    [rect, paletteHex, paletteNumber],
    figma.currentPage
  );
  group.name = paletteNumber.characters;
  group.locked = true;

  return group;
};

figma.ui.onmessage = async (msg) => {
  if (msg.type === "create-palette") {
    figma.root.setPluginData("lastSelectedColor", msg.value);

    const nodes: SceneNode[] = [];
    const { palette } = msg;
    const paletteName: string = msg.name;
    const baseColor: RgbHslHexObject = palette[5];

    await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Regular" }); // missing in browser version

    // Create header rectangle
    const headerRect: RectangleNode = figma.createRectangle();
    const headerName = figma.createText();
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

    const headerRectFills = clone(headerRect.fills);
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
    headerRect.name = `${headerName.characters} - ${headerHex.characters} - ${headerNumber.characters}`;

    const headerGroup = figma.group(
      [headerRect, headerName, headerNumber, headerHex],
      figma.currentPage
    );
    headerGroup.name = `${paletteName} Header`;
    headerGroup.locked = true;
    nodes.push(headerGroup);

    for (let i = 0; i < palette.length; i++) {
      const paletteBar = createPaletteBar({
        size: {
          height: 34,
          width: 360,
        },
        position: {
          y: headerRect.height + i * 34,
        },
        fontSize: 14,
        color: palette[i],
        swatchIndex: i,
      });

      nodes.push(paletteBar);
    }

    const parentFrame = figma.createFrame();
    parentFrame.name = paletteName;
    parentFrame.clipsContent = false;

    // Appends all nodes into wrapping frame
    nodes.forEach((node) => parentFrame.appendChild(node));

    // Resize frame to children width & height
    parentFrame.resize(
      nodes[0].width,
      nodes.reduce((acc, curr) => curr.height + acc, 0)
    );

    figma.currentPage.appendChild(parentFrame);
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  figma.closePlugin();
};

type PaletteBarProps = {
  size: {
    width: number;
    height: number;
  };
  position: {
    x?: number;
    y: number;
  };
  fontSize: number;
  color: {
    rgb: {
      r: number;
      g: number;
      b: number;
    };
    hex: string;
  };
  swatchIndex: number;
};
