import * as React from "react";
import "@mui/material-pigment-css/styles.css";
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from "@mui/material/styles";
import Main from "./main";
import { Provider } from "jotai";
import DefaultPropsProvider from "@mui/material/DefaultPropsProvider";

const theme = createTheme({
  cssVariables: true,
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: "auto",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          padding: "4px 9px",
          fontSize: "0.8125rem",
        },
      },
    },
  },
});

function App() {
  return (
    <DefaultPropsProvider
      value={{
        MuiTextField: {
          variant: "outlined",
          fullWidth: true,
          size: "small",
        },
        MuiSelect: {
          size: "small",
        },
        MuiButton: {
          size: "small",
        },
      }}
    >
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Provider>
            <Main />
          </Provider>
        </ThemeProvider>
      </StyledEngineProvider>
    </DefaultPropsProvider>
  );
}

export default App;
