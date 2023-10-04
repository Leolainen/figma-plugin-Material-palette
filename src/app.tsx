import * as React from "react";
import {
  ThemeProvider,
  /* Theme, */
  StyledEngineProvider,
  createTheme,
} from "@mui/material/styles";
import Main from "./main";
import { Provider } from "jotai";

const theme = createTheme();

/**
 * Root component that handles provders and such
 *
 * @return {JSX.Element}
 */
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
