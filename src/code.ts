import { Message, RgbHslHexObject } from "./types";
import { Settings } from "./store/types/settings";
import { createHeaderBar, createPaletteBar } from "./figma";

const HEADER_MIN_HEIGHT = 122;

figma.showUI(__html__, {
  height: 650,
  width: 890,
});

figma.ui.postMessage({
  storedSettings: figma.root.getPluginData("storedSettings") || "",
});

figma.ui.onmessage = async (msg: Message) => {
  if (msg.type === "create-palette") {
    console.log("storing data:", msg.store);
    // Store plugin data so they load on next launch
    figma.root.setPluginData("storedSettings", JSON.stringify(msg.store));

    const nodes: SceneNode[] = [];
    const { hex, palette, paletteName = "", settings } = msg.data;
    const {
      figma: figmaSettings,
      general: generalSettings,
      material: materialSettings,
    } = settings as Settings;

    const baseColor: RgbHslHexObject = palette[5];
    // const initialHeight = 0;
    let totalHeight = 0;
    let totalWidth = 0;
    const isColumn = generalSettings.paletteDirection === "column";
    const allIsLocked = figmaSettings.lock === "everything";
    const noneIsLocked = figmaSettings.lock === "nothing";

    await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Regular" }); // missing in browser version

    // Create header rectangle
    let headerRect: GroupNode | undefined = undefined;
    const paletteLength = !materialSettings.accent ? 10 : palette.length;

    if (isColumn) {
      totalHeight = generalSettings.colorBarHeight * paletteLength;
      totalWidth = generalSettings.colorBarWidth;
    } else {
      totalHeight = generalSettings.colorBarHeight;
      totalWidth = generalSettings.colorBarWidth * paletteLength;
    }

    if (generalSettings.header) {
      const headerHeight = Math.max(
        HEADER_MIN_HEIGHT,
        generalSettings.colorBarHeight
      );

      headerRect = createHeaderBar({
        width: totalWidth, // generalSettings.colorBarWidth,
        height: headerHeight,
        baseColor,
        name: paletteName,
        locked: figmaSettings.lock,
        isColumn,
      });

      nodes.push(headerRect);

      totalHeight += headerRect.height;
      // initialHeight = headerRect.height;
    }

    for (let i = 0; i < paletteLength; i++) {
      const initialHeight = headerRect?.height || 0;
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
        locked: allIsLocked,
        outlined: figmaSettings.renderWithOutline && palette[i].hex === hex,
      });

      paletteBar.locked = !noneIsLocked;

      nodes.push(paletteBar);
    }

    const parentNodeType = {
      component: figma.createComponent,
      frame: figma.createFrame,
    };

    const parentFrame = parentNodeType[figmaSettings.nodeType]();
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
      if (generalSettings.header && headerRect) {
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
