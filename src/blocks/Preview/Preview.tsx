import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { ColorChangeHandler, ColorResult } from "react-color";
import ColorBar from "../../components/ColorBar";
import ColorPicker from "../../components/ColorPicker";
import { Palette } from "../../types";
import { handleTextContrast } from "../../utils";
import { AppContext } from "../../appContext";
import CircularProgress from "@mui/material/CircularProgress";

const Preview = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedColor, setSelectedColor] =
    React.useState<[keyof Palette, string]>();
  const { paletteName, modifiedPalette, setModifiedPalette, hex, settings } =
    React.useContext(AppContext);
  const { paletteDirection, colorBarWidth, header } = settings.general;

  if (!modifiedPalette) {
    return (
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleSwatchClick = (
    swatch: [string, any],
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setSelectedColor(swatch as typeof selectedColor);
    setAnchorEl(event.currentTarget);
  };

  const handleColorChange: ColorChangeHandler = (color: ColorResult, event) => {
    if (!selectedColor) return;

    const [swatch, hex] = selectedColor;

    if (!swatch || !hex) {
      console.error("no swatch or hex was found");
      return;
    }

    const newPalette: Palette = { ...modifiedPalette };
    newPalette[swatch] = color.hex;

    anchorEl?.setAttribute("style", "background-color: " + color.hex);
  };

  const handleColorPickerClose = () => {
    anchorEl?.removeAttribute("style");
    setAnchorEl(null);
  };

  const handleColorConfirm = (color: ColorResult) => {
    if (!selectedColor) return;

    const [swatch, hex] = selectedColor;

    if (!swatch || !hex) {
      console.error("no swatch or hex was found");
      return;
    }

    const newPalette: Palette = { ...modifiedPalette };
    newPalette[swatch] = color.hex;

    anchorEl?.removeAttribute("style");

    // setPalette(newPalette);
    setModifiedPalette(newPalette);
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        width: "fit-content",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {header && (
        <Stack
          sx={{
            minHeight: 122,
            minWidth: colorBarWidth,
            color: handleTextContrast(modifiedPalette["500"]),
            backgroundColor: modifiedPalette["500"],
          }}
        >
          <Typography px={2} pt={2}>
            {paletteName}
          </Typography>

          <Stack
            direction="row"
            justifyContent={
              paletteDirection === "column" ? "space-between" : "flex-start"
            }
            typography="button"
            mt="auto"
            px={2}
            pb={2}
          >
            <span>500</span>
            <span>{modifiedPalette["500"]}</span>
          </Stack>
        </Stack>
      )}

      <Stack direction={paletteDirection}>
        <ColorPicker
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleColorPickerClose}
          onConfirm={handleColorConfirm}
          onChange={handleColorChange}
          value={(selectedColor && selectedColor[1]) || "#000000"}
        />

        {Object.entries(modifiedPalette).map(([swatchKey, value], idx) => (
          <ColorBar
            key={swatchKey + value}
            swatch={[swatchKey as keyof Palette, value]}
            onClick={handleSwatchClick}
            sx={{
              ...(value === hex && {
                border: "2px dashed white",
              }),
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default Preview;
