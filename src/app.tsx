import * as React from "react";
import {
  ThemeProvider,
  /* Theme, */
  StyledEngineProvider,
  createTheme,
} from "@mui/material/styles";
import { AppContextProvider } from "./appContext";
import Main from "./main";

// declare module '@mui/styles/defaultTheme' {
//   // eslint-disable-next-line @typescript-eslint/no-empty-interface
//   interface DefaultTheme extends Theme {}
// }

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
        <AppContextProvider>
          <Main />
        </AppContextProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
