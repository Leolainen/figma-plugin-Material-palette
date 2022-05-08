import * as React from "react";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import PaletteIcon from "@mui/icons-material/PaletteOutlined";
import { generateMaterialPalette } from "./generators/material";
import { generateLinearPalette } from "./generators/linear";
import { RgbHslHexObject } from "./types";
import { hexToRGB } from "./converters/toRgb";
import { hexToHSL } from "./converters/toHsl";
import Settings from "./blocks/Settings";
import SchemaSelect from "./blocks/SchemaSelect";
import NameInput from "./blocks/NameInput";
import ColorInput from "./blocks/ColorInput";
import DemoArea from "./blocks/DemoArea";
import AppContext from "./appContext";
import { useTheme } from "@mui/material/styles";

const extendColorModel = (hex: string): RgbHslHexObject => ({
  rgb: hexToRGB(hex, true),
  hsl: hexToHSL(hex),
  hex,
});

const Main: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const {
    palette,
    setPalette,
    paletteName,
    schema,
    hex,
    settings,
    modifiedPalette,
  } = React.useContext(AppContext);
  const theme = useTheme();

  const handleCreateClick = () => {
    if (!modifiedPalette) {
      console.error("Palette is missing!");
      return;
    }

    const postPalette = Object.values(modifiedPalette).map((swatchHex) =>
      extendColorModel(swatchHex)
    );

    parent.postMessage(
      {
        pluginMessage: {
          type: "create-palette",
          data: {
            hex,
            paletteName,
            settings,
            schema,
            palette: postPalette,
          },
        },
      },
      "*"
    );
  };

  const handleCancelClick = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  React.useEffect(() => {
    if (!hex) {
      return;
    }

    React.startTransition(() => {
      switch (schema) {
        case "material":
          setPalette(
            generateMaterialPalette(hex, {
              ...settings.material,
            })
          );
          break;
        case "linear":
          setPalette(generateLinearPalette(hex, settings.linear));
          break;
        default:
          console.error("no schema selected. This is impossible!");
      }
    });
  }, [hex, settings, schema]);

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
        <Box>
          <Tabs
            sx={{ flex: "50%" }}
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
          >
            <Tab
              icon={<PaletteIcon />}
              iconPosition="start"
              label="Palette"
              sx={{ minHeight: "auto" }}
            />
            <Tab
              icon={<SettingsIcon />}
              iconPosition="start"
              label="Settings"
              sx={{ minHeight: "auto" }}
            />
          </Tabs>

          <Stack
            direction="row"
            sx={{
              width: "200%",
              position: "relative",
              transition: `transform ${theme.transitions.duration.shorter}ms`,
              transform: `translate(${-50 * activeTab}%)`,
            }}
          >
            <Stack my={2} spacing={2} sx={{ flex: 1 }}>
              <NameInput />
              <ColorInput />
              <SchemaSelect />

              <Button
                onClick={handleCreateClick}
                variant="outlined"
                color="primary"
                disabled={!palette}
                fullWidth
              >
                Create
              </Button>

              <Button
                onClick={handleCancelClick}
                variant="outlined"
                color="error"
                fullWidth
              >
                Cancel
              </Button>
            </Stack>

            <Box sx={{ flex: 1 }}>
              <Settings />
            </Box>
          </Stack>
        </Box>

        <DemoArea />
      </Stack>
    </Stack>
  );
};

export default Main;
