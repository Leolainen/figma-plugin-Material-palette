import * as React from "react";
import TextField from "@mui/material/TextField";
import AppContext from "../../appContext";

/**
 * Input for the name of the palette
 */
const NameInput = () => {
  const [temporaryName, setTemporaryName] = React.useState("");
  const { setPaletteName } = React.useContext(AppContext);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setTemporaryName(event.target.value);
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    setPaletteName(temporaryName);
  };

  return (
    <TextField
      label="Palette name"
      variant="outlined"
      onChange={handleChange}
      onBlur={handleBlur}
      fullWidth
    />
  );
};

export default NameInput;
