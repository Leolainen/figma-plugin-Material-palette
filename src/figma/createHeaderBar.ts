import textNodeContrast from "./textNodeContrast";
import clone from "../utils/clone";
import { RgbHslHexObject } from "../types";
import { Lock } from "../store/types/settings";

type HeaderBarProps = {
  width: number;
  height: number;
  baseColor: RgbHslHexObject;
  name: string;
  locked: Lock;
  isColumn: boolean;
};

const createHeaderBar = ({
  width,
  height,
  baseColor,
  name,
  locked,
  isColumn,
}: HeaderBarProps) => {
  const headerRect = figma.createRectangle();
  const headerName = figma.createText();
  const headerNumber: TextNode = figma.createText();
  const headerHex: TextNode = figma.createText();

  headerRect.resize(width, height);

  headerName.fontSize = 14;
  headerName.x = 20;
  headerName.y = 20;
  headerName.fills = textNodeContrast(headerName, baseColor.hex);
  headerName.characters = name.toUpperCase();
  headerName.locked = locked === "everything";

  headerNumber.fontSize = 14;
  headerNumber.x = 20;
  headerNumber.y = headerRect.height - 30;
  headerNumber.characters = "500";
  headerNumber.fills = textNodeContrast(headerNumber, baseColor.hex);
  headerNumber.locked = locked === "everything";

  headerHex.fontSize = 14;
  headerHex.x = isColumn
    ? headerRect.width - 80
    : headerNumber.x + headerNumber.width + 12;
  headerHex.y = headerNumber.y;
  headerHex.fills = textNodeContrast(headerHex, baseColor.hex);
  headerHex.characters = baseColor.hex.toUpperCase();
  headerHex.locked = locked === "everything";

  const headerRectFills = clone(headerRect.fills);
  headerRectFills[0].color.r = baseColor.rgb.r / 100;
  headerRectFills[0].color.g = baseColor.rgb.g / 100;
  headerRectFills[0].color.b = baseColor.rgb.b / 100;
  headerRect.fills = headerRectFills;
  headerRect.name = `${headerName.characters} - ${headerHex.characters} - ${headerNumber.characters}`;
  headerRect.locked = locked === "everything";

  const headerGroup = figma.group(
    [headerRect, headerName, headerNumber, headerHex],
    figma.currentPage
  );

  headerGroup.name = `${name} Header`;
  headerGroup.locked = locked !== "nothing";

  return headerGroup;
};

export default createHeaderBar;
