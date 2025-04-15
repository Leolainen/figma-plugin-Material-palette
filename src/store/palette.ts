import { atom } from "jotai";
import { Palette, Schema } from "../types";
import { DEFAULT_BASE_COLOR } from "../constants";
import { store } from "./store";

export const hex = atom(DEFAULT_BASE_COLOR);
store.set(hex, DEFAULT_BASE_COLOR);

export const palette = atom<Palette | undefined>(undefined);
store.set(palette, undefined);

export const paletteName = atom<string>("");
store.set(paletteName, "");

export const schema = atom<Schema>("material");
store.set(schema, "material");
