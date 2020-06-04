import { ColorCalc } from "../types";

/**
 * MUI functions
 */
export function lab2xyz(lab: ColorCalc) {
  const y: number = (lab[0] + 16) / 116;
  const x: number = lab[1] / 500 + y;
  const z: number = y - lab[2] / 200;

  return [
    [x, 0.95047],
    [y, 1.0],
    [z, 1.08883],
  ].map((a: [number, number]) => {
    const val = a[0];

    return (
      a[1] *
      (val * val * val > 0.008856 ? val * val * val : (val - 16 / 116) / 7.787)
    );
  });
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
    xyzLAB((0.0193339 * r + 0.119192 * g + 0.9503041 * b) / 1.08883),
  ];
}
