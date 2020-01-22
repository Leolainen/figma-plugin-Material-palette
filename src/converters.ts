import { ColorCalc, RGB, HSL } from "./types";

export function hex2rgb(hex: any) {

  let hexString: string = Array.from(hex).join('');

  return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
    .exec(hexString)
    .slice(1)
    .map(s => parseInt(s, 16));
}

// Hue Chroma Luminance
export function hex2hcl(hex: ColorCalc) {
  return rgb2hcl(hex2rgb(hex));
}

export function lab2hcl(lab: ColorCalc) {
  const [l, a, b] = lab;
  const c = Math.sqrt(a * a + b * b);
  const h = (Math.atan2(b, a) * (180 / Math.PI) + 360) % 360;

  return [Math.round(c * 10000) === 0 ? 0 : h, c, l];
}

export function lab2xyz(lab: ColorCalc) {
  const y: number = (lab[0] + 16) / 116;
  const x: number = lab[1] / 500 + y;
  const z: number = y - lab[2] / 200;

  return [
    [x, 0.95047],
    [y, 1.0],
    [z, 1.08883]
  ].map((a: [number, number]) => {
    const val = a[0];

    return (
      a[1] *
      (val * val * val > 0.008856 ? val * val * val : (val - 16 / 116) / 7.787)
    );
  });
}

export function lab2rgb(lab: ColorCalc) {
  const [x, y, z] = lab2xyz(lab);
  let r: number = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g: number = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let b: number = x * 0.0557 + y * -0.204 + z * 1.057;

  return [r, g, b].map(val => {
    val =
      val > 0.0031308 ? 1.055 * Math.pow(val, 1 / 2.4) - 0.055 : 12.92 * val;

    return Math.max(0, Math.min(1, val)) * 255;
  });
}

export function rgb2hex(rgb: ColorCalc) {
  const [r, g, b] = rgb;
  const _rgb: number = (r << 16) | (g << 8) | b;

  return "#" + ("000000" + _rgb.toString(16)).slice(-6);
}

export function rgb2xyz(rgb: ColorCalc) {
  const rgbXYZ = (val: number) =>
    (val /= 255) <= 0.04045
      ? val / 12.92
      : Math.pow((val + 0.055) / 1.055, 2.4);
  const xyzLAB = (val: number) =>
    val > 0.008856452 ? Math.pow(val, 1 / 3) : val / 0.12841855 + 0.137931034;
  const [r, g, b] = rgb.map(rgbXYZ);

  return [
    xyzLAB((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047),
    xyzLAB(0.2126729 * r + 0.7151522 * g + 0.072175 * b),
    xyzLAB((0.0193339 * r + 0.119192 * g + 0.9503041 * b) / 1.08883)
  ];
}

export function rgb2lab(rgb: ColorCalc) {
  const [x, y, z] = rgb2xyz(rgb);
  const lab: ColorCalc = [116 * y - 16, 500 * (x - y), 200 * (y - z)];

  return lab;
}

export function rgb2hcl(rgb: ColorCalc) {
  return lab2hcl(rgb2lab(rgb));
}

export function hcl2lab(hcl: ColorCalc) {
  let [h, c, l] = hcl;

  h = h * (Math.PI / 180);

  const lab: ColorCalc = [l, Math.cos(h) * c, Math.sin(h) * c];

  return lab;
}

export function hcl2rgb(hcl: ColorCalc) {
  return lab2rgb(hcl2lab(hcl));
}

export function hcl2hex(hcl: ColorCalc) {
  return rgb2hex(hcl2rgb(hcl));
}

// https://css-tricks.com/converting-color-spaces-in-javascript/
export function hexToRGB(hex: string, isPct: boolean = false) {
  let r: any = 0,
    g: any = 0,
    b: any = 0;

  if (hex.length == 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
  } else if (hex.length == 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }

  if (isPct) {
    r = +((r / 255) * 100).toFixed(1);
    g = +((g / 255) * 100).toFixed(1);
    b = +((b / 255) * 100).toFixed(1);
  }

  return {
    r,
    g,
    b,
    string:
      "rgb(" +
      (isPct ? r + "%," + g + "%," + b + "%" : +r + "," + +g + "," + +b) +
      ")"
  };
}

export function hexToHSL(hex: string) {
  // Convert hex to RGB first
  const RGB = hexToRGB(hex);
  let { r, g, b } = RGB;

  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l, string: "hsl(" + h + "," + s + "%," + l + "%)" };
}

export function HSLToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r: any = 0,
    g: any = 0,
    b: any = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return "#" + r + g + b;
}
/**
 *
 * @param {object} RGB Expects an object of r, g, b
 * ex: {
 *  r: 20,
 *  g: 177,
 *  b: 161
 * }
 */
export function RGBToHex(RGB: RGB) {
  let { r, g, b } = RGB;
  let rString = r.toString(16);
  let gString = g.toString(16);
  let bString = b.toString(16);

  if (rString.length == 1) rString = "0" + r;
  if (gString.length == 1) gString = "0" + g;
  if (bString.length == 1) bString = "0" + b;

  return "#" + rString + gString + bString;
}
