import * as React from "react";
import TextField from "@mui/material/TextField";
import { useAtom } from "jotai";
import * as atoms from "../../store";

/**
 * Input for the name of the palette
 */
const NameInput = () => {
  const [, setPaletteName] = useAtom(atoms.paletteNameAtom);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setPaletteName(event.target.value);
  };

  return (
    <TextField
      label="Palette name"
      variant="outlined"
      onChange={handleChange}
      fullWidth
    />
  );
};

export default NameInput;
