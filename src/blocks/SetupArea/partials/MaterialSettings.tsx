import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
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
      <List
        dense
        ref={ref}
        sx={{
          "& li > div:first-child": {
            flex: "70%",
            maxWidth: "65%",
          },
          "& li > *:last-child": {
            maxWidth: "30%",
            ml: "auto",
          },
        }}
      >
        <ListItem disableGutters>
          <ListItemText
            primary="Color pattern algorithm"
            secondary="The base color used for determining the color pattern"
          />

          <TextField
            name="algorithm"
            fullWidth
            select
            value={algorithm}
            onChange={handleChange}
          >
            {["auto", ...Object.keys(BASECOLOR.material)].map((color) => (
              <MenuItem key={color} value={color}>
                {color}
              </MenuItem>
            ))}
          </TextField>
        </ListItem>

        <ListItem disableGutters>
          <ListItemText
            primary="Accent colors"
            secondary="Toggles accent colors if they're available"
          />

          <Switch
            edge="end"
            onChange={handleChange}
            name="accent"
            checked={accent}
          />
        </ListItem>

        <ListItem disableGutters>
          <ListItemText
            primary="Lock swatch"
            secondary="Locks the input value to swatch 500 when active"
          />

          <Switch
            edge="end"
            onChange={handleChange}
            name="lockSwatch"
            checked={lockSwatch}
          />
        </ListItem>
      </List>
    );
  }
);

MaterialSettings.displayName = "MaterialSettings";

export default MaterialSettings;
