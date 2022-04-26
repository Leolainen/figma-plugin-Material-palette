import * as React from "react";
import { Palette, Schema } from "./types";
import { BASECOLOR } from "./constants";

export type AlgorithmSetting = "auto" | keyof typeof BASECOLOR.material;
export type MaterialSettings = {
  algorithm: AlgorithmSetting;
  lockSwatch: boolean;
  accent: boolean;
};

export type Settings = {
  material: MaterialSettings;
};

const defaultSettings = {
  material: {
    algorithm: "auto" as AlgorithmSetting,
    lockSwatch: false,
    accent: true,
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
