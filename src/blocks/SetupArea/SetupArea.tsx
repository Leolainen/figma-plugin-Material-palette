import * as React from "react";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import PaletteIcon from "@mui/icons-material/PaletteOutlined";
import { RgbHslHexObject } from "../../types";
import { hexToRGB } from "../../converters/toRgb";
import { hexToHSL } from "../../converters/toHsl";
import Settings from "../Settings";
import SchemaSelect from "../SchemaSelect";
import NameInput from "../NameInput";
import ColorInput from "../ColorInput";
import { useTheme } from "@mui/material/styles";
import { useAtom } from "jotai";
import * as atoms from "../../store";
import MaterialSettings from "./partials/MaterialSettings";
import LinearSettings from "./partials/LinearSettings";

const extendColorModel = (hex: string): RgbHslHexObject => ({
  rgb: hexToRGB(hex, true),
  hsl: hexToHSL(hex),
  hex,
});

const SetupArea: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [palette] = useAtom(atoms.paletteAtom);
  const [hex] = useAtom(atoms.hexAtom);
  const [paletteName] = useAtom(atoms.paletteNameAtom);
  const [schema] = useAtom(atoms.schemaAtom);
  const [settings] = useAtom(atoms.settingsAtom);
  const theme = useTheme();

  const handleCreateClick = () => {
    if (!palette) {
      console.error("Palette is missing!");
      return;
    }

    const postPalette = Object.values(palette).map((swatchHex) =>
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
          store: {
            schema,
            settings,
            hex,
            palette,
          },
        },
      },
      "*"
    );
  };

  const handleCancelClick = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  return (
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

          {schema === "linear" && <LinearSettings />}
          {schema === "material" && <MaterialSettings />}

          <Box mt="auto">
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
              sx={{ mt: 1 }}
            >
              Cancel
            </Button>
          </Box>
        </Stack>
        <Box sx={{ flex: 1 }}>
          <Settings />
        </Box>
      </Stack>
    </Box>
  );
};

export default SetupArea;
