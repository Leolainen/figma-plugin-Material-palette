import { BASECOLOR } from "../../constants";

export type NodeType = "component" | "frame";
export type Lock = "everything" | "swatches" | "nothing";
export type PaletteDirection = "column" | "row";
export type Algorithm = "auto" | keyof typeof BASECOLOR.material;
export type MaterialSettings = {
  algorithm: Algorithm;
  lockSwatch: boolean;
  accent: boolean;
};

export type FigmaSettings = {
  nodeType: NodeType;
  renderWithOutline: boolean; // render outline around input hex in figma
  lock: Lock;
};

export type GeneralSettings = {
  // presets: "default" | "boxes";
  paletteDirection: PaletteDirection;
  colorBarWidth: number;
  colorBarHeight: number;
  header: boolean; // toggle the big heading color
};

export type LinearSettings = {
  hueMultiplier: number; // 0 - 1 (0 - 100%?)
  lightnessMultiplier: number; // 0 - 1 (0 - 100%?)
  saturationMultiplier: number;
};

export type Settings = {
  material: MaterialSettings;
  figma: FigmaSettings;
  linear: LinearSettings;
  general: GeneralSettings;
};
