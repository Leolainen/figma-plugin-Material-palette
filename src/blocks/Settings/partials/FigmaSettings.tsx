import * as React from "react";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import AppContext, { FigmaSettings, Settings } from "../../../appContext";

interface Props {}

const FigmaSettings = React.forwardRef<HTMLUListElement, Props>(
  (props, ref) => {
    const { settings, setSettings } = React.useContext(AppContext);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      type FigmaSettingsValueType = FigmaSettings[keyof FigmaSettings];

      let value: FigmaSettingsValueType;

      if (event.target.type === "checkbox") {
        value = event.target.checked;
      } else {
        value = event.target.value as FigmaSettingsValueType;
      }

      const newSettings: Settings = {
        ...settings,
        figma: {
          ...settings.figma,
          [event.target.name as keyof FigmaSettings]: value,
        },
      };

      setSettings(newSettings);
    };

    return (
      <List dense ref={ref}>
        <ListSubheader>Figma</ListSubheader>

        <Divider />

        <ListItem>
          <ListItemText
            primary="Node type"
            secondary="What node type will be used as the root for the palette"
          />

          <TextField select defaultValue={settings.figma.nodeType} fullWidth>
            <MenuItem value="component">Component</MenuItem>
            <MenuItem value="frame">Frame</MenuItem>
            <MenuItem value="rectangle">Rectangle</MenuItem>
          </TextField>
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Lock"
            secondary="The nodes that should be locked in the palete"
          />

          <TextField select defaultValue={settings.figma.lock} fullWidth>
            <MenuItem value="everything">Everything</MenuItem>
            <MenuItem value="swatches">Swatches</MenuItem>
            <MenuItem value="nothing">Nothing</MenuItem>
          </TextField>
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Render with outlines"
            secondary="Draw an outline around the input color when created in Figma"
          />

          <Checkbox
            onChange={handleChange}
            name="renderWithOutline"
            defaultChecked={settings.figma.renderWithOutline}
          />
        </ListItem>
      </List>
    );
  }
);

FigmaSettings.displayName = "FigmaSettings";

export default FigmaSettings;
