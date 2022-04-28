import * as React from "react";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import AppContext, { GeneralSettings, Settings } from "../../../appContext";

interface Props {}

const GeneralSettings = React.forwardRef<HTMLUListElement, Props>(
  (props, ref) => {
    const { settings, setSettings } = React.useContext(AppContext);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      type GeneralSettingsValueType = GeneralSettings[keyof GeneralSettings];

      let value: GeneralSettingsValueType;

      if (event.target.type === "checkbox") {
        value = event.target.checked;
      } else {
        value = event.target.value as GeneralSettingsValueType;
      }

      const newSettings: Settings = {
        ...settings,
        general: {
          ...settings.general,
          [event.target.name as keyof GeneralSettings]: value,
        },
      };

      setSettings(newSettings);
    };

    return (
      <List dense ref={ref}>
        <ListSubheader>General</ListSubheader>

        <Divider />

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
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Direction"
            secondary="Arrange colors in row or column"
          />

          <TextField
            select
            defaultValue="column"
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
            defaultValue={360}
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
            defaultValue={34}
            name="colorBarHeight"
            onChange={handleChange}
          />
        </ListItem>
      </List>
    );
  }
);

GeneralSettings.displayName = "GeneralSettings";

export default GeneralSettings;
