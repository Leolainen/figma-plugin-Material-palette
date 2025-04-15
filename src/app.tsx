import * as React from "react";
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from "@mui/material/styles";
import Main from "./main";
import { Provider } from "jotai";

const theme = createTheme({
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
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
        size: "small",
      },
    },
    MuiSelect: {
      defaultProps: {
        size: "small",
      },
    },
    MuiButton: {
      defaultProps: {
        size: "small",
      },
    },
  },
});

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Provider>
          <Main />
        </Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
