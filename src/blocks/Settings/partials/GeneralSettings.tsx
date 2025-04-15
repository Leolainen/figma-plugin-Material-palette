import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import { useAtom } from "jotai";
import * as atoms from "../../../store";
import * as SettingsTypes from "../../../store/types/settings";

interface Props { }

const GeneralSettings = React.forwardRef<HTMLUListElement, Props>(
    (props, ref) => {
        const [paletteDirection, setPaletteDirection] = useAtom(
            atoms.paletteDirection
        );
        const [colorBarWidth, setColorBarWidth] = useAtom(atoms.colorBarWidth);
        const [colorBarHeight, setColorBarHeight] = useAtom(
            atoms.colorBarHeight
        );
        const [header, setHeader] = useAtom(atoms.header);

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            let value;

            if (event.target.type === "checkbox") {
                value = event.target.checked;
            } else {
                // fix bug with rect resizing in figma
                if (["colorBarWidth", "colorBarHeight"].includes(event.target.name)) {
                    value = parseInt(event.target.value, 10);
                } else {
                    value = event.target.value;
                }
            }

            switch (event.target.name) {
                case "paletteDirection":
                    setPaletteDirection(value as SettingsTypes.PaletteDirection);
                    break;
                case "colorBarWidth":
                    setColorBarWidth(value as number);
                    break;
                case "colorBarHeight":
                    setColorBarHeight(value as number);
                    break;
                case "header":
                    setHeader(value as boolean);
                    break;
                default:
                    break;
            }
        };

        return (
            <>
                {/* 
        <ListItem disableGutters>
          <ListItemText
            primary="Presets"
            secondary="Presets for palette layout"
          />

          <TextField
            placeholder="Presets"
            select
            defaultValue="default"
            fullWidth
            name="presets"
            onChange={handleChange}
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="boxes">Boxes</MenuItem>
          </TextField>
        </ListItem> */}

                <ListItem disableGutters>
                    <ListItemText
                        primary="Direction"
                        secondary="Arrange colors in row or column"
                    />

                    <TextField
                        select
                        value={paletteDirection}
                        fullWidth
                        name="paletteDirection"
                        onChange={handleChange}
                    >
                        <MenuItem value="row">Row</MenuItem>
                        <MenuItem value="column">Column</MenuItem>
                    </TextField>
                </ListItem>

                <ListItem disableGutters>
                    <ListItemText
                        primary="Swatch width"
                        secondary="The width of the swatches in pixels"
                    />

                    <TextField
                        placeholder="swatch width"
                        type="number"
                        value={colorBarWidth}
                        name="colorBarWidth"
                        onChange={handleChange}
                    />
                </ListItem>

                <ListItem disableGutters>
                    <ListItemText
                        primary="Swatch height"
                        secondary="The height of the swatches in pixels"
                    />

                    <TextField
                        placeholder="swatch height"
                        type="number"
                        value={colorBarHeight}
                        name="colorBarHeight"
                        onChange={handleChange}
                    />
                </ListItem>

                <ListItem disableGutters>
                    <ListItemText
                        primary="Header color"
                        secondary="Toggle the header color"
                    />

                    <Switch
                        edge="end"
                        onChange={handleChange}
                        name="header"
                        checked={header}
                    />
                </ListItem>
            </>
        );
    }
);

GeneralSettings.displayName = "GeneralSettings";

export default GeneralSettings;
