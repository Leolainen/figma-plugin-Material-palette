import * as React from "react";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import AppContext, { MaterialSettings, Settings } from "../../../appContext";
import { BASECOLOR } from "../../../constants";

interface Props {}

const MaterialSettings = React.forwardRef<HTMLUListElement, Props>(
  (props, ref) => {
    const { settings, setSettings } = React.useContext(AppContext);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      type MaterialSettingsValueType = MaterialSettings[keyof MaterialSettings];

      let value: MaterialSettingsValueType;

      if (event.target.type === "checkbox") {
        value = event.target.checked;
      } else {
        value = event.target.value as MaterialSettingsValueType;
      }

      const newSettings: Settings = {
        ...settings,
        material: {
          ...settings.material,
          [event.target.name as keyof MaterialSettings]: value,
        },
      };

      setSettings(newSettings);
    };

    return (
      <List dense ref={ref}>
        <ListSubheader>Palette (Material schema)</ListSubheader>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Color pattern algorithm"
            secondary="Set which algorithm the palette should generate with"
          />

          <TextField
            name="algorithm"
            fullWidth
            select
            defaultValue={settings.material.algorithm}
            onChange={handleChange}
          >
            {["auto", ...Object.keys(BASECOLOR.material)].map((color) => (
              <MenuItem key={color} value={color}>
                {color}
              </MenuItem>
            ))}
          </TextField>
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Accent colors"
            secondary="Toggles accent colors if they're available"
          />

          <Switch
            edge="end"
            onChange={handleChange}
            name="accent"
            defaultChecked={settings.material.accent}
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Lock swatch"
            secondary="Locks the input value to swatch 500 when active"
          />

          <Switch
            edge="end"
            onChange={handleChange}
            name="lockSwatch"
            defaultChecked={settings.material.lockSwatch}
          />
        </ListItem>
      </List>
    );
  }
);

MaterialSettings.displayName = "MaterialSettings";

export default MaterialSettings;
