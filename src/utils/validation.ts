export const hexColorReg = /^#?([A-F0-9]{6}|[A-F0-9]{3})$/i;
export const fullHexColorReg = /^#?([A-F0-9]{6})$/i;

export const isValidHex = (hex: string) => fullHexColorReg.test(hex);
