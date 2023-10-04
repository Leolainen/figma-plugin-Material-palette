/**
 * Material algorithm
 * Kudos to Sebastian Lasse
 * https://codepen.io/sebilasse/pen/GQYKJd
 */
export const COLORKEYS = [
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
  "a700",
];

export const FULL_COLOR_KEYS = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "a100",
  "a200",
  "a400",
  "a700",
] as const;

export const BASECOLOR = {
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
    blueGrey: "#607d8b",
  },
} as const;

export const DEFAULT_BASE_COLOR = "#F1392B";

export const defaultHCLMods = {
  red: {
    lighter: {
      h: -1,
      c: 0,
      l: 9,
    },
    darker: {
      h: 2,
      c: 0,
      l: 6,
    },
  },
  deepOrange: {
    lighter: {
      h: 1,
      c: 0,
      l: 7,
    },
    darker: {
      h: 0,
      c: 0,
      l: 6,
    },
  },
  orange: {
    lighter: {
      h: -1,
      c: 0,
      l: 6,
    },
    darker: {
      h: 4,
      c: 0,
      l: 5,
    },
  },
  amber: {
    lighter: {
      h: -1,
      c: -4,
      l: 4,
    },
    darker: {
      h: 6,
      c: -2,
      l: 4,
    },
  },
  yellow: {
    lighter: {
      h: 1,
      c: -10,
      l: 2,
    },
    darker: {
      h: 3,
      c: -3,
      l: 3,
    },
  },
  lime: {
    lighter: {
      h: 2,
      c: 0,
      l: 8,
    },
    darker: {
      h: -1,
      c: 0,
      l: 2,
    },
  },
  lightGreen: {
    lighter: {
      h: 1,
      c: -3,
      l: 7,
    },
    darker: {
      h: -2,
      c: 3,
      l: 4,
    },
  },
  green: {
    lighter: {
      h: 1,
      c: -2,
      l: 9,
    },
    darker: {
      h: 0,
      c: -2,
      l: 6,
    },
  },
  teal: {
    lighter: {
      h: -6,
      c: -1,
      l: 5,
    },
    darker: {
      h: 0,
      c: -2,
      l: 4,
    },
  },
  cyan: {
    lighter: {
      h: 0,
      c: -2,
      l: 6,
    },
    darker: {
      h: -2,
      c: -3,
      l: 4,
    },
  },
  lightBlue: {
    lighter: {
      h: 5,
      c: 2,
      l: 6,
    },
    darker: {
      h: 2,
      c: 1,
      l: 5,
    },
  },
  blue: {
    lighter: {
      h: 0,
      c: -2,
      l: 6,
    },
    darker: {
      h: 2,
      c: -2,
      l: 6,
    },
  },
  indigo: {
    lighter: {
      h: 0,
      c: 2,
      l: 7,
    },
    darker: {
      h: -1,
      c: 2,
      l: 5,
    },
  },
  deepPurple: {
    lighter: {
      h: -2,
      c: 0,
      l: 7,
    },
    darker: {
      h: 0,
      c: 1,
      l: 5,
    },
  },
  purple: {
    lighter: {
      h: -1,
      c: 0,
      l: 5,
    },
    darker: {
      h: 0,
      c: 2,
      l: 5,
    },
  },
  pink: {
    lighter: {
      h: 1,
      c: -1,
      l: 5,
    },
    darker: {
      h: 0,
      c: 1,
      l: 4,
    },
  },
  brown: {
    lighter: {
      h: 1,
      c: -2,
      l: 5,
    },
    darker: {
      h: -2,
      c: 2,
      l: 5,
    },
  },
  grey: {
    lighter: {
      h: -1,
      c: 0,
      l: 5,
    },
    darker: {
      h: -1,
      c: 0,
      l: 5,
    },
  },
  blueGrey: {
    lighter: {
      h: 1,
      c: -2,
      l: 5,
    },
    darker: {
      h: 1,
      c: 1,
      l: 5,
    },
  },
};
