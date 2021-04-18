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

export type Schema = {
  [key: string]: Array<[number, number, number]>;
};

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

export type BaseColor = {
  [key: string]: BaseColorList;
};
