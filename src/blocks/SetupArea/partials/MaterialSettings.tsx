import * as React from "react";
import Stack from "@mui/material/Stack";
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
    const [algorithm, setAlgorithm] = useAtom(atoms.algorithm);
    const [lockSwatch, setLockSwatch] = useAtom(atoms.lockSwatch);
    const [accent, setAccent] = useAtom(atoms.accent);

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
      <Stack>
        <TextField
          name="algorithm"
          label="Algorithm"
          helperText="Which color algorithm to use"
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
      </Stack>
    );
  },
);

MaterialSettings.displayName = "MaterialSettings";

export default MaterialSettings;
