import * as React from "react";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import TextField from "@mui/material/TextField";
import AppContext, { LinearSettings, Settings } from "../../../appContext";

interface Props {}

const LinearSettings = React.forwardRef<HTMLUListElement, Props>(
  (props, ref) => {
    const { settings, setSettings } = React.useContext(AppContext);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      type LinearSettingsTypeValue = LinearSettings[keyof LinearSettings];

      const value = parseInt(event.target.value, 10) as LinearSettingsTypeValue;

      const newSettings: Settings = {
        ...settings,
        linear: {
          ...settings.linear,
          [event.target.name as keyof LinearSettings]: value,
        },
      };

      setSettings(newSettings);
    };

    return (
      <List dense ref={ref}>
        <ListSubheader>Palette (Linear schema)</ListSubheader>

        <Divider />

        <ListItem>
          <ListItemText
            primary="Hue modifier"
            secondary="Applies a multiplier that modifies the hue on each swatch"
          />

          <TextField
            defaultValue={settings.linear.hueMultiplier}
            name="hueMultiplier"
            type="number"
            onChange={handleChange}
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Lightness modifier"
            secondary="Applies a multiplier that modifies the lightness on each swatch"
          />

          <TextField
            defaultValue={settings.linear.lightnessMultiplier}
            name="lightnessMultiplier"
            type="number"
            onChange={handleChange}
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Saturation modifier"
            secondary="Applies a multiplier that modifies the saturation on each swatch"
          />

          <TextField
            defaultValue={settings.linear.saturationMultiplier}
            name="saturationMultiplier"
            type="number"
            onChange={handleChange}
          />
        </ListItem>
      </List>
    );
  }
);

LinearSettings.displayName = "LinearSettings";

export default LinearSettings;
