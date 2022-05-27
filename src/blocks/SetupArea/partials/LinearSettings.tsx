import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import { useAtom } from "jotai";
import * as atoms from "../../../store";

interface Props {}

const LinearSettings = React.forwardRef<HTMLUListElement, Props>(
  (props, ref) => {
    const [hueMultiplier, setHueMultiplier] = useAtom(atoms.hueMultiplierAtom);
    const [saturationMultiplier, setSaturationMultiplier] = useAtom(
      atoms.saturationMultiplierAtom
    );
    const [lightnessMultiplier, setLightnessMultiplier] = useAtom(
      atoms.lightnessMultiplierAtom
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.target.value || "0", 10);

      switch (event.target.name) {
        case "hueMultiplier":
          setHueMultiplier(value);
          break;
        case "saturationMultiplier":
          setSaturationMultiplier(value);
          break;
        case "lightnessMultiplier":
          setLightnessMultiplier(value);
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
            primary="Hue modifier"
            secondary="Applies a multiplier that modifies the hue on each swatch"
          />

          <TextField
            value={hueMultiplier}
            name="hueMultiplier"
            type="number"
            onChange={handleChange}
          />
        </ListItem>

        <ListItem disableGutters>
          <ListItemText
            primary="Lightness modifier"
            secondary="Applies a multiplier that modifies the lightness on each swatch"
          />

          <TextField
            value={lightnessMultiplier}
            name="lightnessMultiplier"
            type="number"
            onChange={handleChange}
          />
        </ListItem>

        <ListItem disableGutters>
          <ListItemText
            primary="Saturation modifier"
            secondary="Applies a multiplier that modifies the saturation on each swatch"
          />

          <TextField
            value={saturationMultiplier}
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
