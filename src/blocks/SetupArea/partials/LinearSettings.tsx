import * as React from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useAtom } from "jotai";
import * as atoms from "../../../store";

interface Props {}

const LinearSettings = React.forwardRef<HTMLUListElement, Props>(
  (props, ref) => {
    const [hueMultiplier, setHueMultiplier] = useAtom(atoms.hueMultiplier);
    const [saturationMultiplier, setSaturationMultiplier] = useAtom(
      atoms.saturationMultiplier,
    );
    const [lightnessMultiplier, setLightnessMultiplier] = useAtom(
      atoms.lightnessMultiplier,
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
      <Stack gap={2}>
        <TextField
          value={hueMultiplier}
          name="hueMultiplier"
          type="number"
          onChange={handleChange}
          label="Hue"
          helperText="Modifies the difference of hue for each swatch"
        />

        <TextField
          value={lightnessMultiplier}
          name="lightnessMultiplier"
          type="number"
          onChange={handleChange}
          label="Lightness"
          helperText="Modifies the difference in lightness for each swatch"
        />

        <TextField
          value={saturationMultiplier}
          name="saturationMultiplier"
          type="number"
          onChange={handleChange}
          label="Saturation"
          helperText="Modifies the difference in saturation for each swatch"
        />
      </Stack>
    );
  },
);

LinearSettings.displayName = "LinearSettings";

export default LinearSettings;
