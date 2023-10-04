import { Settings } from "./store/types/settings";

export type ColorCalc = number[];

export type RGB = {
  r: number;
  g: number;
  b: number;
  string: string;
};

export type HSL = {
  h: number;
  s: number;
  l: number;
  string: string;
};

export type RgbHslHexObject = {
  rgb: RGB;
  hsl: HSL;
  hex: string;
};

export type Schema = "material" | "linear" | "natural";

export type BaseColorList = {
  red: "#f44336";
  deepOrange: "#ff5722";
  orange: "#ff9800";
  amber: "#ffc107";
  yellow: "#ffeb3b";
  lime: "#cddc39";
  lightGreen: "#8bc34a";
  green: "#4caf50";
  teal: "#009688";
  cyan: "#00bcd4";
  lightBlue: "#03a9f4";
  blue: "#2196f3";
  indigo: "#3f51b5";
  deepPurple: "#673ab7";
  purple: "#9c27b0";
  pink: "#e91e63";
  brown: "#795548";
  grey: "#9e9e9e";
  blueGrey: "#607d8b";
};

export type BaseColorKey =
  | "red"
  | "deepOrange"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "lightGreen"
  | "green"
  | "teal"
  | "cyan"
  | "lightBlue"
  | "blue"
  | "indigo"
  | "deepPurple"
  | "purple"
  | "pink"
  | "brown"
  | "grey"
  | "blueGrey";

export type MaterialSwatchValues = {
  // eslint-disable-next-line no-unused-vars -- I only want the key
  [key in BaseColorKey]: Array<[number, number, number]>;
};

export type ColorKeys =
  | "50"
  | "100"
  | "200"
  | "300"
  | "400"
  | "600"
  | "700"
  | "800"
  | "900"
  | "a100"
  | "a200"
  | "a400"
  | "a700";

export type FullColorKeys =
  | "50"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | "a100"
  | "a200"
  | "a400"
  | "a700";

export interface ChromePickerColor {
  hsl: {
    h: number;
    s: number;
    l: number;
    a: number;
  };
  hex: string;
  rgb: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  hsv: { h: number; s: number; v: number; a: number };
  oldHue: number;
  source: string;
}

export interface Palette {
  "50": string;
  "100": string;
  "200": string;
  "300": string;
  "400": string;
  "500": string;
  "600": string;
  "700": string;
  "800": string;
  "900": string;
  a100?: string;
  a200?: string;
  a400?: string;
  a700?: string;
}

export interface StoredData {
  schema: Schema;
  settings: Settings;
  hex: string;
  palette: Palette;
}

export interface PluginMessage {
  pluginMessage: {
    storedSettings: string;
  };
}

export interface MessageData {
  hex: string;
  settings: Settings;
  palette: RgbHslHexObject[];
  paletteName: string;
  schema: Schema;
}
export interface Message {
  type: string;
  data: MessageData;
  store: StoredData;
}
