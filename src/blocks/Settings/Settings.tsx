import * as React from "react";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import AppContext, { Settings } from "../../appContext";
import { BASECOLOR } from "../../constants";

interface Props {}

const Settings = React.forwardRef<HTMLUListElement, Props>((props, ref) => {
  const { settings, setSettings } = React.useContext(AppContext);

  const handleChange =
    (schema: "material") => (event: React.ChangeEvent<HTMLInputElement>) => {
      type SettingsValueType =
        Settings[typeof schema][keyof Settings[typeof schema]];

      let value: SettingsValueType;

      if (event.target.type === "checkbox") {
        console.log("event.target.checked", event.target.checked);
        value = event.target.checked;
      } else {
        console.log("event.target.value", event.target.value);
        value = event.target.value as SettingsValueType;
      }

      console.log("value", value);
      const newSettings: Settings = {
        ...settings,
        [schema]: {
          ...settings[schema],
          [event.target.name]: value,
        },
      };

      setSettings(newSettings);
    };

  return (
    <Stack
      ref={ref}
      sx={{ maxHeight: 550 }} // spread this as props later
    >
      <List dense>
        <ListSubheader>Material</ListSubheader>
        <Divider />
        <ListItem sx={{ flexDirection: "column", alignItems: "start" }}>
          <ListItemText
            primary="Base color algorithm"
            secondary="Manually set which color to modulate the palette with"
          />
          <TextField
            name="algorithm"
            fullWidth
            select
            defaultValue="auto"
            onChange={handleChange("material")}
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
            onChange={handleChange("material")}
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
            onChange={handleChange("material")}
            name="lockSwatch"
            defaultChecked={settings.material.lockSwatch}
          />
        </ListItem>
      </List>

      <List dense>
        <ListSubheader>Figma</ListSubheader>
        <Divider />
        <ListItem
          sx={{
            pr: 15,

            "& .MuiListItemSecondaryAction-root": {
              maxWidth: 102,
            },
          }}
          secondaryAction={
            <TextField
              placeholder="palette direction"
              select
              defaultValue="column"
              fullWidth
            >
              <MenuItem value="column">Column</MenuItem>
              <MenuItem value="row">Row</MenuItem>
            </TextField>
          }
        >
          <ListItemText
            primary="Palette direction"
            secondary="The direction in which the colors are arranged"
          />
        </ListItem>

        <ListItem
          sx={{
            "& .MuiListItemSecondaryAction-root": {
              maxWidth: 72,
            },
          }}
          secondaryAction={
            <TextField
              placeholder="swatch width"
              type="number"
              defaultValue={360}
            />
          }
        >
          <ListItemText
            primary="Swatch width"
            secondary="edit the width of the swatch in pixels"
          />
        </ListItem>

        <ListItem
          sx={{
            "& .MuiListItemSecondaryAction-root": {
              maxWidth: 72,
            },
          }}
          secondaryAction={
            <TextField
              placeholder="swatch height"
              type="number"
              defaultValue={34}
            />
          }
        >
          <ListItemText
            primary="Swatch height"
            secondary="edit the width of the swatch in pixels"
          />
        </ListItem>
      </List>
    </Stack>
  );
});

Settings.displayName = "Settings";

export default Settings;
