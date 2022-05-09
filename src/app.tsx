import * as React from "react";
import {
  ThemeProvider,
  /* Theme, */
  StyledEngineProvider,
  createTheme,
} from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import { initialValues, Context, AppContextProvider } from "./appContext";
import Main from "./main";
import { StoredData } from "./types";

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
  const [initContextValues, setInitContextValues] = React.useState<
    Context | undefined
  >(undefined);

  /**
   * a bit overkill but a failsafe to prevent crashing/soft lock if user
   * has incorrect message data stored
   */
  const validateSettings = (settings: StoredData): boolean => {
    const settingsKeys = Object.keys(settings);
    const keysToInclude = ["hex", "settings", "schema", "palette"];
    const containsAllKeys = settingsKeys.every((key) =>
      keysToInclude.includes(key)
    );
    const shouldNotBeMissingKeys = keysToInclude
      .map((key) => settingsKeys.indexOf(key) > -1)
      .every(Boolean);

    if (!containsAllKeys || !shouldNotBeMissingKeys) {
      return false;
    }

    if (typeof settings.hex !== "string") {
      return false;
    }

    return true;
  };

  const handleMessageEvent = (event: MessageEvent) => {
    if (
      !event.data ||
      !event.data.pluginMessage ||
      !event.data.pluginMessage.storedSettings
    ) {
      setInitContextValues(initialValues);
      return;
    }

    const { storedSettings } = event.data.pluginMessage;
    const settings = JSON.parse(storedSettings) as StoredData;
    let context: Context;

    const isValid = validateSettings(settings);

    if (isValid) {
      context = {
        ...initialValues,
        ...settings,
        modifiedPalette: settings.palette,
      };
    } else {
      console.warn(
        "stored settings failed validation – restoring all settings to default"
      );
      context = initialValues;
    }

    setInitContextValues(context);
  };

  React.useLayoutEffect(() => {
    window.addEventListener("message", handleMessageEvent);

    () => {
      window.removeEventListener("message", handleMessageEvent);
    };
  }, []);

  if (!initContextValues) {
    return <CircularProgress />;
  }

  return (
    <AppContextProvider value={initContextValues}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Main />
        </ThemeProvider>
      </StyledEngineProvider>
    </AppContextProvider>
  );
}

export default App;
