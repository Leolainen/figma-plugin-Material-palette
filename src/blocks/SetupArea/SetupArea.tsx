import * as React from "react";
import { useAtom } from "jotai";
import { useTheme } from "@mui/material-pigment-css";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Box from "@mui/material-pigment-css/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Divider from "@mui/material/Divider";
import DownloadIcon from "@mui/icons-material/Download";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PaletteIcon from "@mui/icons-material/PaletteOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material-pigment-css/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import * as atoms from "../../store";
import ColorInput from "../ColorInput";
import NameInput from "../NameInput";
import SchemaSelect from "../SchemaSelect";
import Settings from "../Settings";
import { RgbHslHexObject } from "../../types";
import { hexToHSL } from "../../converters/toHsl";
import { hexToRGB } from "../../converters/toRgb";
import MaterialSettings from "./partials/MaterialSettings";
import LinearSettings from "./partials/LinearSettings";
import NaturalSettings from "./partials/NaturalSettings";

const extendColorModel = (hex: string): RgbHslHexObject => ({
  rgb: hexToRGB(hex, true),
  hsl: hexToHSL(hex),
  hex,
});

const SetupArea = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [palette] = useAtom(atoms.palette);
  const [hex] = useAtom(atoms.hex);
  const [paletteName] = useAtom(atoms.paletteName);
  const [schema] = useAtom(atoms.schema);
  const [settings] = useAtom(atoms.settings);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleCreateOptional = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreateClick = () => {
    if (!palette) {
      console.error("Palette is missing!");
      return;
    }

    const postPalette = Object.values(palette).map((swatchHex) =>
      extendColorModel(swatchHex),
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
      "*",
    );
  };

  const handleCancelClick = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(palette, null, 2)], {
      type: "application/json",
    });

    const a = document.createElement("a");
    a.download = `${paletteName || hex}.json`;
    a.href = URL.createObjectURL(blob);
    a.textContent = "Download";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(a.href);
  };

  return (
    <Box
      sx={{
        borderRightWidth: 1,
        borderRightStyle: "solid",
        borderRightColor: "divider",
        pr: 2,
        height: "100%",
        display: "grid",
        gridTemplateRows: "min-content 1fr",
        gap: 2,
      }}
      ref={containerRef}
    >
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
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <Slide
          appear={false}
          direction="right"
          in={activeTab === 0}
          mountOnEnter
          unmountOnExit
          container={containerRef.current}
          easing={theme.transitions.easing.easeOut}
        >
          <Stack
            gap={2}
            sx={{
              position: "absolute",
              height: "inherit",
              width: "100%",
            }}
          >
            <NameInput />
            <ColorInput />
            <SchemaSelect />

            <Divider sx={{ my: 2 }} />

            {schema === "linear" && <LinearSettings />}
            {schema === "material" && <MaterialSettings />}
            {schema === "natural" && <NaturalSettings />}

            <Stack
              mt="auto"
              gap={1}
              direction="row"
              alignSelf="end"
              width="100%"
            >
              <Button
                onClick={handleCancelClick}
                variant="outlined"
                color="error"
                fullWidth
              >
                Close
              </Button>

              <ButtonGroup
                color="primary"
                variant="outlined"
                disabled={!palette}
                sx={{ width: "100%" }}
              >
                <Button fullWidth onClick={handleCreateClick}>
                  Create
                </Button>

                <Button
                  size="small"
                  aria-label="select merge strategy"
                  aria-haspopup="menu"
                  onClick={handleCreateOptional}
                >
                  <ArrowDropDownIcon />
                </Button>
              </ButtonGroup>

              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={handleDownload}>
                  <ListItemIcon>
                    <DownloadIcon fontSize="small" />
                  </ListItemIcon>
                  Download palette as JSON
                </MenuItem>
              </Menu>
            </Stack>
          </Stack>
        </Slide>

        <Slide
          direction="left"
          in={activeTab === 1}
          mountOnEnter
          unmountOnExit
          container={containerRef.current}
          easing={theme.transitions.easing.easeOut}
        >
          <Box
            sx={{
              position: "absolute",
            }}
          >
            <Settings />
          </Box>
        </Slide>
      </Stack>
    </Box>
  );
};

export default SetupArea;
