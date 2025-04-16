import { type Theme } from "@mui/material/styles";

declare module "@mui/material-pigment-css" {
  // eslint-disable-next-line no-unused-vars
  interface ThemeArgs {
    theme: Theme;
  }
}
