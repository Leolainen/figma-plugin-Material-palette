import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { ColorChangeHandler, ColorResult } from "react-color";
import ColorBar from "../../components/ColorBar";
import ColorPicker from "../../components/ColorPicker";
import { Palette } from "../../types";
import { handleTextContrast } from "../../utils";

interface Props {
  colorValue: string;
  paletteName: string;
  preview: Palette;
  onPaletteChange: (palette: Palette) => void;
}

const Preview = ({
  colorValue,
  paletteName,
  preview,
  onPaletteChange,
}: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedColor, setSelectedColor] =
    React.useState<[keyof Palette, string]>();

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

    const newPalette: Palette = { ...preview };
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

    const newPalette: Palette = { ...preview };
    newPalette[swatch] = color.hex;

    anchorEl?.removeAttribute("style");

    onPaletteChange(newPalette);
    setAnchorEl(null);
  };

  if (!preview) {
    return <p>loading palette</p>;
  }

  return (
    <Box mx={2}>
      <Box
        sx={{
          width: 360,
          margin: "auto",
        }}
      >
        <Box
          sx={{
            height: 102,
            display: "flex",
            flexDirection: "column",
            color: handleTextContrast(preview["500"]),
            backgroundColor: preview["500"],
          }}
        >
          <Typography px={2} pt={2}>
            {paletteName}
          </Typography>

          <Stack
            direction="row"
            justifyContent="space-between"
            typography="button"
            mt="auto"
            px={2}
            pb={2}
          >
            <span>500</span>
            <span>{preview["500"]}</span>
          </Stack>
        </Box>

        <ColorPicker
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleColorPickerClose}
          onConfirm={handleColorConfirm}
          onChange={handleColorChange}
          value={(selectedColor && selectedColor[1]) || "#000000"}
        />

        {Object.entries(preview).map(([swatchKey, value], idx) => (
          <ColorBar
            key={swatchKey + value}
            swatch={[swatchKey as keyof Palette, value]}
            onClick={handleSwatchClick}
            sx={{
              ...(value === colorValue && {
                border: "2px dashed white",
                padding: "18px",
              }),
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Preview;
