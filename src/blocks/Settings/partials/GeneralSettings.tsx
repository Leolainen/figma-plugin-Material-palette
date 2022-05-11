import * as React from "react";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import { useAtom } from "jotai";
import * as atoms from "../../../store";
import * as SettingsTypes from "../../../store/types/settings";

interface Props {}

const GeneralSettings = React.forwardRef<HTMLUListElement, Props>(
  (props, ref) => {
    const [paletteDirection, setPaletteDirection] = useAtom(
      atoms.paletteDirectionAtom
    );
    const [colorBarWidth, setColorBarWidth] = useAtom(atoms.colorBarWidthAtom);
    const [colorBarHeight, setColorBarHeight] = useAtom(
      atoms.colorBarHeightAtom
    );
    const [header, setHeader] = useAtom(atoms.headerAtom);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let value;

      if (event.target.type === "checkbox") {
        value = event.target.checked;
      } else {
        // fix bug with rect resizing in figma (code.ts, line: 91)
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
      <List dense ref={ref}>
        <ListSubheader>General</ListSubheader>

        <Divider />
        {/* 
        <ListItem>
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

        <ListItem>
          <ListItemText
            primary="Direction"
            secondary="Arrange colors in row or column"
          />

          <TextField
            select
            defaultValue={paletteDirection}
            fullWidth
            name="paletteDirection"
            onChange={handleChange}
          >
            <MenuItem value="row">Row</MenuItem>
            <MenuItem value="column">Column</MenuItem>
          </TextField>
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Swatch width"
            secondary="edit the width of the swatch in pixels"
          />

          <TextField
            placeholder="swatch width"
            type="number"
            defaultValue={colorBarWidth}
            name="colorBarWidth"
            onChange={handleChange}
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Swatch height"
            secondary="edit the width of the swatch in pixels"
          />

          <TextField
            placeholder="swatch height"
            type="number"
            defaultValue={colorBarHeight}
            name="colorBarHeight"
            onChange={handleChange}
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Header color"
            secondary="Toggles the primary 500 color as a header"
          />

          <Switch
            edge="end"
            onChange={handleChange}
            name="header"
            defaultChecked={header}
          />
        </ListItem>
      </List>
    );
  }
);

GeneralSettings.displayName = "GeneralSettings";

export default GeneralSettings;
