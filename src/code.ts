import { COLORKEYS } from "./constants";
import clone from "./utils/clone";
import { getContrastRatio } from "./utils/contrast";
import { Message, RgbHslHexObject } from "./types";
import { rgbToHex } from "./converters/toHex";
import { Settings } from "./appContext";

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
  storedSettings: figma.root.getPluginData("storedSettings") || "",
});

const createPaletteBar = (paletteBarProps: PaletteBarProps) => {
  const {
    size: { width, height },
    position: { x, y },
    fontSize,
    color: { rgb, hex },
    swatchIndex,
  } = paletteBarProps;
  const PADDING_Y = 8;
  const PADDING_X = 20;
  const rect = figma.createRectangle();
  const paletteHex: TextNode = figma.createText();
  const paletteNumber: TextNode = figma.createText();

  const shouldTextBeColumn = width < 150;
  const centerX = width / 2;
  const centerY = height / 2;

  const calcTextPositions = (textWidth: number, textHeight: number) => {
    return {
      horizontal: {
        start: x + PADDING_X,
        center: x + centerX - textWidth / 2,
        end: x + width - PADDING_X - textWidth,
      },
      vertical: {
        start: y + PADDING_Y,
        center: y + centerY - textHeight / 2,
        end: y + height - PADDING_Y - textHeight,
      },
    };
  };

  paletteHex.fontSize = fontSize;
  paletteNumber.fontSize = fontSize;

  // Get contrast ratio to set paletteHex color
  paletteHex.fills = handleTextNodeContrast(paletteHex, hex);
  paletteNumber.fills = handleTextNodeContrast(paletteHex, hex);
  rect.fills = paintNode({
    node: rect,
    rgb: [rgb.r, rgb.g, rgb.b],
  });

  paletteHex.characters = hex.toUpperCase();
  paletteNumber.characters = fullColorKeys[swatchIndex];

  const paletteHexPositions = calcTextPositions(
    paletteHex.width,
    paletteHex.height
  );
  const paletteNumberPositions = calcTextPositions(
    paletteNumber.width,
    paletteNumber.height
  );

  paletteHex.x = shouldTextBeColumn
    ? paletteHexPositions.horizontal.center
    : paletteHexPositions.horizontal.end;
  paletteHex.y = shouldTextBeColumn
    ? paletteHexPositions.vertical.end
    : paletteHexPositions.vertical.center;
  paletteNumber.x = shouldTextBeColumn
    ? paletteNumberPositions.horizontal.center
    : paletteNumberPositions.horizontal.start;
  paletteNumber.y = shouldTextBeColumn
    ? paletteHexPositions.vertical.start
    : paletteHexPositions.vertical.center;

  rect.resize(width, height);
  rect.y = y;
  rect.x = x;

  rect.name = `${paletteNumber.characters} ${hex}`;

  const group = figma.group(
    [rect, paletteHex, paletteNumber],
    figma.currentPage
  );

  group.name = paletteNumber.characters;

  return group;
};

figma.ui.onmessage = async (msg: Message) => {
  if (msg.type === "create-palette") {
    // Store plugin data so they load on next launch
    figma.root.setPluginData(
      "storedSettings",
      JSON.stringify({
        schema: msg.data.schema,
        settings: msg.data.settings,
        hex: msg.data.hex,
      })
    );

    const nodes: SceneNode[] = [];
    const { palette, paletteName = "", settings } = msg.data;
    const {
      figma: figmaSettings,
      general: generalSettings,
      // material: materialSettings,
    } = settings as Settings;
    const baseColor: RgbHslHexObject = palette[5];
    let initialHeight = 0;
    let totalHeight = 0;
    let totalWidth = 0;
    const isColumn = generalSettings.paletteDirection === "column";

    await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Regular" }); // missing in browser version

    // Create header rectangle
    const headerRect: RectangleNode = figma.createRectangle();

    if (generalSettings.header) {
      const headerName = figma.createText();
      const headerNumber: TextNode = figma.createText();
      const headerHex: TextNode = figma.createText();
      const HEADER_MIN_HEIGHT = 122;

      headerRect.resize(
        generalSettings.colorBarWidth,
        Math.max(HEADER_MIN_HEIGHT, generalSettings.colorBarHeight)
      );

      headerName.fontSize = 14;
      headerName.x = 20;
      headerName.y = 20;
      headerName.fills = handleTextNodeContrast(headerName, baseColor.hex);
      headerName.characters = paletteName.toUpperCase();

      headerNumber.fontSize = 14;
      headerNumber.x = 20;
      headerNumber.y = headerRect.height - 30;
      headerNumber.characters = "500";
      headerNumber.fills = handleTextNodeContrast(headerNumber, baseColor.hex);

      headerHex.fontSize = 14;
      headerHex.x = isColumn
        ? headerRect.width - 80
        : headerNumber.x + headerNumber.width + 12;
      headerHex.y = headerNumber.y;
      headerHex.fills = handleTextNodeContrast(headerHex, baseColor.hex);
      headerHex.characters = baseColor.hex.toUpperCase();

      const headerRectFills = clone(headerRect.fills);
      headerRectFills[0].color.r = baseColor.rgb.r / 100;
      headerRectFills[0].color.g = baseColor.rgb.g / 100;
      headerRectFills[0].color.b = baseColor.rgb.b / 100;
      headerRect.fills = headerRectFills;
      headerRect.name = `${headerName.characters} - ${headerHex.characters} - ${headerNumber.characters}`;

      const headerGroup = figma.group(
        [headerRect, headerName, headerNumber, headerHex],
        figma.currentPage
      );
      headerGroup.name = `${paletteName} Header`;
      headerGroup.locked = true;
      nodes.push(headerGroup);

      totalHeight += headerRect.height;
      initialHeight = headerRect.height;
    }

    for (let i = 0; i < palette.length; i++) {
      const paletteBar = createPaletteBar({
        size: {
          height: generalSettings.colorBarHeight,
          width: generalSettings.colorBarWidth,
        },
        position: {
          x: isColumn ? 0 : i * generalSettings.colorBarWidth,
          y: isColumn
            ? initialHeight + i * (generalSettings.colorBarHeight || 34)
            : initialHeight,
        },
        fontSize: 14,
        color: palette[i],
        swatchIndex: i,
      });

      paletteBar.locked = figmaSettings.lock !== "nothing";

      if (isColumn) {
        totalHeight += paletteBar.height;
        totalWidth = paletteBar.width;
      } else {
        totalHeight = paletteBar.height + initialHeight;
        totalWidth += paletteBar.width;
      }

      nodes.push(paletteBar);
    }

    const parentFrame = figma.createFrame();
    parentFrame.name = paletteName;
    parentFrame.clipsContent = false;

    // Appends all nodes into wrapping frame
    nodes.reverse().forEach((node) => parentFrame.appendChild(node));

    // Resize frame to children width & height
    if (isColumn) {
      parentFrame.resize(
        nodes[0].width,
        nodes.reduce((acc, curr) => curr.height + acc, 0)
      );
    } else {
      if (generalSettings.header) {
        headerRect.resize(totalWidth, headerRect.height);
      }
      parentFrame.resize(totalWidth, totalHeight);
    }

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
    x: number;
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
