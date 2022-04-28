import * as React from "react";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import PaletteIcon from "@mui/icons-material/PaletteOutlined";
import { generateMaterialPalette } from "./generators/material";
import { generateLinearPalette } from "./generators/linear";
import { Palette, RgbHslHexObject } from "./types";
import { hexToRGB } from "./converters/toRgb";
import { hexToHSL } from "./converters/toHsl";
import { isValidHex } from "./utils/validation";
import Preview from "./blocks/Preview";
import Settings from "./blocks/Settings";
import PreviewError from "./blocks/PreviewError";
import SchemaSelect from "./blocks/SchemaSelect";
import NameInput from "./blocks/NameInput";
import ColorInput from "./blocks/ColorInput";
import AppContext from "./appContext";
import { useTheme } from "@mui/material/styles";

const extendColorModel = (hex: string): RgbHslHexObject => ({
  rgb: hexToRGB(hex, true),
  hsl: hexToHSL(hex),
  hex,
});

const accents = ["a100", "a200", "a400", "a700"] as const;

const Main: React.FC = () => {
  const [modifiedPalette, setModifiedPalette] = React.useState<Palette>();
  const [hasAccents, setHasAccents] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);
  const [zoom, setZoom] = React.useState(75);
  const { palette, setPalette, paletteName, schema, hex, settings } =
    React.useContext(AppContext);
  const theme = useTheme();

  React.useEffect(() => {
    setModifiedPalette(palette);
  }, [palette]);

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
          schema,
          palette: postPalette,
          value: hex,
          paletteName,
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

  React.useEffect(() => {
    if (palette) {
      const paletteClone = { ...palette };
      const foundAccents = accents.every((accent) => accent in paletteClone);

      if (foundAccents !== hasAccents) {
        setHasAccents(foundAccents);
      }

      // remove accents if material schema and accents is turned off
      if (foundAccents && !settings.material.accent) {
        accents.forEach((accent) => delete paletteClone[accent]);

        setModifiedPalette(paletteClone);
      }
    }
  }, [hasAccents, settings.material.accent, palette, setModifiedPalette]);

  const handlePreviewChange = (previewPalette: Palette) => {
    setPalette(previewPalette);
  };

  const handleSlideChange = (
    event: Event,
    value: number | number[],
    activeThumb: number
  ) => {
    setZoom(value as number);
  };

  const error = !palette || !modifiedPalette || !hex || !isValidHex(hex);
  return (
    <Stack px={2} sx={{ height: "inherit" }}>
      <Stack spacing={4} alignItems="center" direction="row" pt={4}>
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

        <Slider
          sx={{ flex: "50%" }}
          defaultValue={75}
          min={50}
          max={100}
          onChange={handleSlideChange}
          valueLabelDisplay="auto"
          marks={[
            {
              value: 50,
              label: "50%",
            },
            {
              value: 75,
              label: "75%",
            },
            {
              value: 100,
              label: "100%",
            },
          ]}
        />
      </Stack>

      <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
        <Box sx={{ flex: 1, overflow: "hidden" }}>
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

        <Box sx={{ flex: 1 }}>
          {error ? (
            <PreviewError />
          ) : (
            <Box sx={{ height: "inherit", overflow: "hidden" }}>
              <Box
                sx={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "center",
                  transition: `transform ${theme.transitions.duration.shortest}ms ease-out`,
                }}
              >
                <Preview
                  preview={modifiedPalette}
                  paletteName={paletteName || ""}
                  colorValue={hex}
                  onPaletteChange={handlePreviewChange}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Stack>
    </Stack>
  );
};

export default Main;
