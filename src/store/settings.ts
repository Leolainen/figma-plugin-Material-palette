import * as SettingsTypes from "./types/settings";
import { atom } from "jotai";

export const defaultSettings: SettingsTypes.Settings = {
  material: {
    algorithm: "auto" as SettingsTypes.Algorithm,
    lockSwatch: false,
    accent: true,
  },
  figma: {
    nodeType: "component",
    lock: "swatches",
    renderWithOutline: false,
  },
  general: {
    // presets: "default",
    paletteDirection: "column",
    colorBarWidth: 360,
    colorBarHeight: 34,
    header: true,
  },
  linear: {
    hueMultiplier: 0,
    lightnessMultiplier: 0,
    saturationMultiplier: 0,
  },
};

const algorithm = atom<SettingsTypes.Algorithm>("auto");
export const algorithmAtom = atom<
  SettingsTypes.Algorithm,
  SettingsTypes.Algorithm
>(
  (get) => get(algorithm),
  (_get, set, newAlgorithm) => {
    set(algorithm, newAlgorithm);
  }
);

const lockSwatch = atom<boolean>(false);
export const lockSwatchAtom = atom<boolean, boolean>(
  (get) => get(lockSwatch),
  (_get, set, newLockSwatch) => {
    set(lockSwatch, newLockSwatch);
  }
);

const accent = atom<boolean>(true);
export const accentAtom = atom<boolean, boolean>(
  (get) => get(accent),
  (_get, set, newAccent) => {
    set(accent, newAccent);
  }
);

const nodeType = atom<SettingsTypes.NodeType>("component");
export const nodeTypeAtom = atom<
  SettingsTypes.NodeType,
  SettingsTypes.NodeType
>(
  (get) => get(nodeType),
  (_get, set, newNodeType) => {
    set(nodeType, newNodeType);
  }
);

const lock = atom<SettingsTypes.Lock>("swatches");
export const lockAtom = atom<SettingsTypes.Lock, SettingsTypes.Lock>(
  (get) => get(lock),
  (_get, set, newLock) => {
    set(lock, newLock);
  }
);

const renderWithOutline = atom<boolean>(false);
export const renderWithOutlineAtom = atom<boolean, boolean>(
  (get) => get(renderWithOutline),
  (_get, set, newRenderWithOutline) => {
    set(renderWithOutline, newRenderWithOutline);
  }
);

const paletteDirection = atom<SettingsTypes.PaletteDirection>("column");
export const paletteDirectionAtom = atom<
  SettingsTypes.PaletteDirection,
  SettingsTypes.PaletteDirection
>(
  (get) => get(paletteDirection),
  (_get, set, newPaletteDirection) => {
    set(paletteDirection, newPaletteDirection);
  }
);

const colorBarWidth = atom<number>(360);
export const colorBarWidthAtom = atom<number, number>(
  (get) => get(colorBarWidth),
  (_get, set, newColorBarWidth) => {
    set(colorBarWidth, newColorBarWidth);
  }
);

const colorBarHeight = atom<number>(34);
export const colorBarHeightAtom = atom<number, number>(
  (get) => get(colorBarHeight),
  (_get, set, newColorBarHeight) => {
    set(colorBarHeight, newColorBarHeight);
  }
);

const header = atom<boolean>(true);
export const headerAtom = atom<boolean, boolean>(
  (get) => get(header),
  (_get, set, newHeader) => {
    set(header, newHeader);
  }
);

const hueMultiplier = atom<number>(0);
export const hueMultiplierAtom = atom<number, number>(
  (get) => get(hueMultiplier),
  (_get, set, newHueMultiplier) => {
    set(hueMultiplier, newHueMultiplier);
  }
);

const lightnessMultiplier = atom<number>(0);
export const lightnessMultiplierAtom = atom<number, number>(
  (get) => get(lightnessMultiplier),
  (_get, set, newLightnessMultiplier) => {
    set(lightnessMultiplier, newLightnessMultiplier);
  }
);

const saturationMultiplier = atom<number>(0);
export const saturationMultiplierAtom = atom<number, number>(
  (get) => get(saturationMultiplier),
  (_get, set, newSaturationMultiplier) => {
    set(saturationMultiplier, newSaturationMultiplier);
  }
);

export const settingsAtom = atom<
  SettingsTypes.Settings,
  SettingsTypes.Settings
>(
  (get) => {
    return {
      material: {
        algorithm: get(algorithm),
        lockSwatch: get(lockSwatch),
        accent: get(accent),
      },
      figma: {
        nodeType: get(nodeType),
        lock: get(lock),
        renderWithOutline: get(renderWithOutline),
      },
      general: {
        // presets: "default",
        paletteDirection: get(paletteDirection),
        colorBarWidth: get(colorBarWidth),
        colorBarHeight: get(colorBarHeight),
        header: get(header),
      },
      linear: {
        hueMultiplier: get(hueMultiplier),
        lightnessMultiplier: get(lightnessMultiplier),
        saturationMultiplier: get(saturationMultiplier),
      },
    };
  },
  (_get, set, newSettings) => {
    set(algorithm, newSettings.material.algorithm);
    set(lockSwatch, newSettings.material.lockSwatch);
    set(accent, newSettings.material.accent);
    set(nodeType, newSettings.figma.nodeType);
    set(lock, newSettings.figma.lock);
    set(renderWithOutline, newSettings.figma.renderWithOutline);
    set(paletteDirection, newSettings.general.paletteDirection);
    set(colorBarWidth, newSettings.general.colorBarWidth);
    set(colorBarHeight, newSettings.general.colorBarHeight);
    set(header, newSettings.general.header);
    set(hueMultiplier, newSettings.linear.hueMultiplier);
    set(lightnessMultiplier, newSettings.linear.lightnessMultiplier);
    set(saturationMultiplier, newSettings.linear.saturationMultiplier);
  }
);
