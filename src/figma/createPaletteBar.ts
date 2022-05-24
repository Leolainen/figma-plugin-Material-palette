import textNodeContrast from "./textNodeContrast";
import paintNode from "./paintNode";
import { FULL_COLOR_KEYS } from "../constants";

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
  locked: boolean;
  outlined: boolean;
};

const createPaletteBar = (paletteBarProps: PaletteBarProps) => {
  const {
    size: { width, height },
    position: { x, y },
    fontSize,
    color: { rgb, hex },
    swatchIndex,
    locked,
    outlined,
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
  paletteHex.fills = textNodeContrast(paletteHex, hex);
  paletteNumber.fills = textNodeContrast(paletteHex, hex);
  rect.fills = paintNode({
    node: rect,
    rgb: [rgb.r, rgb.g, rgb.b],
  });

  paletteHex.characters = hex.toUpperCase();
  paletteNumber.characters = FULL_COLOR_KEYS[swatchIndex];

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

  paletteHex.locked = locked;
  paletteNumber.locked = locked;
  rect.locked = locked;

  if (outlined) {
    rect.strokes = paintNode({
      node: rect,
      rgb: [100, 100, 100],
    });
    rect.strokeAlign = "INSIDE";
    rect.strokeWeight = 2;
    rect.dashPattern = [3, 3];
  }

  const group = figma.group(
    [rect, paletteHex, paletteNumber],
    figma.currentPage
  );

  group.name = paletteNumber.characters;

  return group;
};

export default createPaletteBar;
