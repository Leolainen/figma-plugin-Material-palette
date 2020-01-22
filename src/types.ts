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
    red: string;
    deepOrange: string;
    orange: string;
    amber: string;
    yellow: string;
    lime: string;
    lightGreen: string;
    green: string;
    teal: string;
    cyan: string;
    lightBlue: string;
    blue: string;
    indigo: string;
    deepPurple: string;
    purple: string;
    pink: string;
    brown: string;
    grey: string;
    blueGrey: string;
};

export type BaseColor = {
    [key: string]: BaseColorList;
};
