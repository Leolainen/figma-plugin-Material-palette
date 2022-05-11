import * as React from "react";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import { BASECOLOR } from "../../../constants";
import { useAtom } from "jotai";
import * as atoms from "../../../store";
import * as SettingsTypes from "../../../store/types/settings";

interface Props {}

const MaterialSettings = React.forwardRef<HTMLUListElement, Props>(
  (props, ref) => {
    const [algorithm, setAlgorithm] = useAtom(atoms.algorithmAtom);
    const [lockSwatch, setLockSwatch] = useAtom(atoms.lockSwatchAtom);
    const [accent, setAccent] = useAtom(atoms.accentAtom);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let value;

      if (event.target.type === "checkbox") {
        value = event.target.checked;
      } else {
        value = event.target.value;
      }

      switch (event.target.name) {
        case "algorithm":
          setAlgorithm(value as SettingsTypes.Algorithm);
          break;
        case "lockSwatch":
          setLockSwatch(value as boolean);
          break;
        case "accent":
          setAccent(value as boolean);
          break;
        default:
          break;
      }
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
            defaultValue={algorithm}
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
            defaultChecked={accent}
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
            defaultChecked={lockSwatch}
          />
        </ListItem>
      </List>
    );
  }
);

MaterialSettings.displayName = "MaterialSettings";

export default MaterialSettings;
