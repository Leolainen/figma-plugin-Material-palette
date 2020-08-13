import { COLORKEYS, DEFAULT_BASE_COLOR } from "./constants";
import {
  hexToRGB
} from './converters/toRgb';
import { hexToHSL } from './converters/toHsl';
import clone from './utils/clone';
import { handleTextNodeContrast } from './utils/contrast';
import { RgbHslHexObject } from "./types";
import { generateMaterialPalette } from './generators/material';
import { generateMonochromePalette } from './generators/monochrome';

figma.showUI(__html__, {
  height: 650,
  width: 890
});

figma.ui.postMessage({
  lastSelectedColor: figma.root.getPluginData('lastSelectedColor') || DEFAULT_BASE_COLOR
});

figma.ui.onmessage = async msg => {
  if (msg.type === "create-palette") {
    figma.root.setPluginData('lastSelectedColor', msg.value);

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
