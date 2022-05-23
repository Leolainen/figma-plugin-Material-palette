import { atom } from "jotai";
import { Palette, Schema } from "../types";
import { DEFAULT_BASE_COLOR } from "../constants";

const hex = atom(DEFAULT_BASE_COLOR);
export const hexAtom = atom<string, string>(
  (get) => get(hex),
  (_get, set, newHex) => {
    set(hex, newHex);
  }
);

const palette = atom<Palette | undefined>(undefined);
export const paletteAtom = atom<Palette | undefined, Palette>(
  (get) => get(palette),
  (_get, set, newPalette) => {
    set(palette, newPalette);
  }
);

const paletteName = atom<string>("");
export const paletteNameAtom = atom<string, string>(
  (get) => get(paletteName),
  (_get, set, newPaletteName) => {
    set(paletteName, newPaletteName);
  }
);

const schema = atom<Schema>("material");
export const schemaAtom = atom<Schema, Schema>(
  (get) => get(schema),
  (_get, set, newSchema) => {
    set(schema, newSchema);
  }
);
