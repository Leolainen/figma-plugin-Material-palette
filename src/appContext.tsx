import * as React from "react";
import { Palette, Schema } from "./types";
import { BASECOLOR } from "./constants";

export type AlgorithmSetting = "auto" | keyof typeof BASECOLOR.material;
export type MaterialSettings = {
  algorithm: AlgorithmSetting;
  lockSwatch: boolean;
  accent: boolean;
};

// TODO: add these settings
export type FigmaSettings = {
  nodeType: "component" | "frame" | "rectangle";
  renderWithOutline: boolean; // render outline around input hex in figma
  lock: "everything" | "swatches" | "nothing";
};

// TODO: Add these settings
export type GeneralSettings = {
  presets: "default" | "boxes"; // these should only run logic inside context
  paletteDirection: "column" | "row";
  colorBarWidth: number;
  colorBarHeight: number;
  primaryColor: boolean; // toggle the big heading color
};

// RENAME MONOCHROME?? (suggestions: linear, basic, simple, )
// TODO: add these settings
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

const defaultSettings: Settings = {
  material: {
    algorithm: "auto" as AlgorithmSetting,
    lockSwatch: false,
    accent: true,
  },
  figma: {
    nodeType: "component",
    lock: "swatches",
    renderWithOutline: false,
  },
  general: {
    presets: "default",
    paletteDirection: "column",
    colorBarWidth: 360,
    colorBarHeight: 34,
    primaryColor: true,
  },
  linear: {
    hueMultiplier: 0,
    lightnessMultiplier: 0,
    saturationMultiplier: 0,
  },
};

const initialValues: Context = {
  hex: undefined,
  palette: undefined,
  paletteName: undefined,
  schema: "material",
  settings: defaultSettings,
  setHex: () => {},
  setPalette: () => {},
  setPaletteName: () => {},
  setSchema: () => {},
  setSettings: () => {},
};

interface Context {
  hex?: string;
  palette?: Palette;
  paletteName?: string;
  schema: Schema;
  settings: Settings;
  setHex: (value: string) => void;
  setPalette: (value: Palette | undefined) => void;
  setPaletteName: (value: string) => void;
  setSchema: (value: Schema) => void;
  setSettings: (value: Settings) => void;
}

const useAppContext = (props = initialValues): Context => {
  const [paletteName, setContextPaletteName] = React.useState<
    string | undefined
  >(props.paletteName);
  const [hex, setContextHex] = React.useState<string | undefined>(props.hex);
  const [palette, setContextPalette] = React.useState<Palette | undefined>(
    props.palette
  );
  const [schema, setContextSchema] = React.useState<Schema>(props.schema);
  const [settings, setContextSettings] = React.useState<Settings>(
    props.settings
  );

  const setHex: Context["setHex"] = React.useCallback((value: string) => {
    setContextHex(value);
  }, []);

  const setPalette: Context["setPalette"] = React.useCallback((value) => {
    setContextPalette(value);
  }, []);

  const setPaletteName: Context["setPaletteName"] = React.useCallback(
    (value) => {
      setContextPaletteName(value);
    },
    []
  );

  const setSettings: Context["setSettings"] = React.useCallback((value) => {
    console.log("settings update", value);
    setContextSettings(value);
  }, []);

  const setSchema: Context["setSchema"] = React.useCallback((value) => {
    setContextSchema(value);
  }, []);

  return {
    hex,
    setHex,
    palette,
    schema,
    settings,
    setPalette,
    paletteName,
    setPaletteName,
    setSchema,
    setSettings,
  };
};

export const AppContext = React.createContext(initialValues);

export const AppContextProvider = (props: {
  children: React.ReactNode;
  value?: Context;
}) => {
  const { value: customValues = initialValues, children } = props;
  const value = useAppContext(customValues);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
