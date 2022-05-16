import * as React from "react";
import { useAtom } from "jotai";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import { generateLinearPalette } from "./generators/linear";
import { generateMaterialPalette } from "./generators/material";
import DemoArea from "./blocks/DemoArea";
import SetupArea from "./blocks/SetupArea";
import * as atoms from "./store";
import { PluginMessage, StoredData } from "./types";

const Main: React.FC = () => {
  const [hex] = useAtom(atoms.hexAtom);
  const [schema] = useAtom(atoms.schemaAtom);
  const [settings, setSettings] = useAtom(atoms.settingsAtom);
  const [, setSchema] = useAtom(atoms.schemaAtom);
  const [, setHex] = useAtom(atoms.hexAtom);
  const [, setPalette] = useAtom(atoms.paletteAtom);

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!hex || loading) {
      return;
    }

    React.startTransition(() => {
      switch (schema) {
        case "material":
          const nextPalette = generateMaterialPalette(hex, {
            ...settings.material,
          });

          if (!nextPalette) {
            return;
          }

          setPalette(nextPalette);
          break;
        case "linear":
          setPalette(generateLinearPalette(hex, settings.linear));
          break;
        default:
          console.error("no schema selected. This is impossible!");
      }
    });
  }, [hex, settings, schema]);

  const applyStoredData = (data: StoredData): void => {
    setHex(data.hex);
    setSchema(data.schema);
    setSettings(data.settings);
    setPalette(data.palette);
  };

  // get stored data
  const handleMessageEvent = (event: MessageEvent<PluginMessage>) => {
    if (
      !event.data ||
      !event.data.pluginMessage ||
      !event.data.pluginMessage.storedSettings
    ) {
      setLoading(false);
      return;
    }

    const { storedSettings } = event.data.pluginMessage;
    const storedData = JSON.parse(storedSettings) as StoredData;

    applyStoredData(storedData);

    // necessary to prevent stored data from being overwritten
    setTimeout(() => {
      setLoading(false);
    }, 0);
  };

  React.useLayoutEffect(() => {
    window.addEventListener("message", handleMessageEvent);

    () => {
      window.removeEventListener("message", handleMessageEvent);
    };
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Stack px={2} sx={{ height: "inherit" }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          "& > div": {
            flex: 1,
            overflow: "hidden",
          },
        }}
      >
        <SetupArea />

        <DemoArea />
      </Stack>
    </Stack>
  );
};

export default Main;
