import { BaseColor } from './types';

/**
 * Material algorithm
 * Kudos to Sebastian Lasse
 * https://codepen.io/sebilasse/pen/GQYKJd
 */
export const COLORKEYS: string[] = [
    "50",
    "100",
    "200",
    "300",
    "400",
    "600",
    "700",
    "800",
    "900",
    "a100",
    "a200",
    "a400",
    "a700"
];

export const BASECOLOR: BaseColor = {
    /* should have l*sl 15 - 35 */
    material: {
        red: "#f44336",
        deepOrange: "#ff5722",
        orange: "#ff9800",
        amber: "#ffc107",
        yellow: "#ffeb3b",
        lime: "#cddc39",
        lightGreen: "#8bc34a",
        green: "#4caf50",
        teal: "#009688",
        cyan: "#00bcd4",
        lightBlue: "#03a9f4",
        blue: "#2196f3",
        indigo: "#3f51b5",
        deepPurple: "#673ab7",
        purple: "#9c27b0",
        pink: "#e91e63",
        brown: "#795548",
        grey: "#9e9e9e",
        blueGrey: "#607d8b"
    }
};
