import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { ColorChangeHandler, ColorResult } from "react-color";
import ColorBar from "../../components/ColorBar";
import ColorPicker from "../../components/ColorPicker";
import { Palette } from "../../types";
import { handleTextContrast } from "../../utils";
import CircularProgress from "@mui/material/CircularProgress";
import { useAtom } from "jotai";
import * as atoms from "../../store";

const ACCENTS = ["a100", "a200", "a400", "a700"];

const Preview = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedColor, setSelectedColor] =
        React.useState<[keyof Palette, string]>();
    const [paletteName] = useAtom(atoms.paletteName);
    const [palette, setPalette] = useAtom(atoms.palette);
    const [hex] = useAtom(atoms.hex);
    const [paletteDirection] = useAtom(atoms.paletteDirection);
    const [colorBarWidth] = useAtom(atoms.colorBarWidth);
    const [header] = useAtom(atoms.header);
    const [accent] = useAtom(atoms.accent);

    if (!palette) {
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

        const newPalette: Palette = { ...palette };
        newPalette[swatch] = color.hex;

        anchorEl?.removeAttribute("style");

        setPalette(newPalette);
        setAnchorEl(null);
    };

    const demoPalette = accent
        ? palette
        : Object.keys(palette).reduce((acc, curr) => {
            if (ACCENTS.includes(curr)) {
                return acc;
            }

            return { ...acc, [curr]: palette[curr as keyof Palette] };
        }, {} as Palette);

    return (
        <Stack
            sx={{
                width: "fit-content",
            }}
            m="auto"
        >
            {header && (
                <Stack
                    sx={{
                        minHeight: 122,
                        minWidth: colorBarWidth,
                        color: handleTextContrast(palette["500"]),
                        backgroundColor: palette["500"],
                    }}
                >
                    <Typography px={2} pt={2}>
                        {paletteName.toUpperCase()}
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
                        <Box component="span" ml={paletteDirection === "row" ? 2 : 0}>
                            {palette["500"]}
                        </Box>
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
                    anchorOrigin={{
                        vertical: "center",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "center",
                        horizontal: "right",
                    }}
                />

                {Object.entries(demoPalette).map(([swatchKey, value], idx) => (
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
        </Stack>
    );
};

export default Preview;
