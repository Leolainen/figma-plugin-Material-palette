import * as React from "react";
import { useAtom, useSetAtom } from "jotai";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Fade from "@mui/material/Fade";
import { generateNaturalPalette } from "./generators/natural";
import { generateLinearPalette } from "./generators/linear";
import { generateMaterialPalette } from "./generators/material";
import DemoArea from "./blocks/DemoArea";
import SetupArea from "./blocks/SetupArea";
import * as atoms from "./store";
import { PluginMessage, StoredData } from "./types";
import { defaultSettings } from "./store";

const Main: React.FC = () => {
  const [settings, setSettings] = useAtom(atoms.settings);
  const [schema, setSchema] = useAtom(atoms.schema);
  const [hex, setHex] = useAtom(atoms.hex);
  const setPalette = useSetAtom(atoms.palette);
  const [algorithm] = useAtom(atoms.algorithm);
  const [lockSwatch] = useAtom(atoms.lockSwatch);
  const [hueMultiplier] = useAtom(atoms.hueMultiplier);
  const [lightnessMultiplier] = useAtom(atoms.lightnessMultiplier);
  const [saturationMultiplier] = useAtom(atoms.saturationMultiplier);
  const [darkerModifiers] = useAtom(atoms.darkerModifiers);
  const [lighterModifiers] = useAtom(atoms.lighterModifiers);
  const [customHCLToggled] = useAtom(atoms.customHCLToggled);

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
        case "natural":
          setPalette(generateNaturalPalette(hex, settings.natural));
          break;
        default:
          console.error("no schema selected. This is impossible!");
      }
    });
  }, [
    hex,
    schema,
    algorithm,
    lockSwatch,
    hueMultiplier,
    lightnessMultiplier,
    saturationMultiplier,
    darkerModifiers,
    lighterModifiers,
    customHCLToggled,
  ]);

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
    const {
      schema: cachedSchema = schema,
      settings: cachedSettings = defaultSettings,
      hex: cachedHex = hex,
      palette: cachedPalette,
    } = JSON.parse(storedSettings) as StoredData;

    applyStoredData({
      hex: cachedHex,
      schema: cachedSchema,
      palette: cachedPalette,
      settings: { ...defaultSettings, ...cachedSettings },
    });

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
    return (
      <Stack
        direction="row"
        spacing={2}
        sx={{
          height: "100%",
          "& > div": {
            flex: 1,
            overflow: "hidden",
          },
        }}
      >
        <Skeleton variant="rectangular" sx={{ height: "100%", width: "50%" }} />
        <Skeleton variant="rectangular" sx={{ height: "100%", width: "50%" }} />
      </Stack>
    );
  }

  return (
    <Fade in={!loading}>
      <Stack px={2} sx={{ height: "inherit" }}>
        <Stack
          direction="row"
          sx={{
            height: "100%",
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
    </Fade>
  );
};

export default Main;
