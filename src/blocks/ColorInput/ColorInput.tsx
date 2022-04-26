import * as React from "react";
import { ColorResult, ColorChangeHandler } from "react-color";
import { Colorize as ColorizeIcon } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { DEFAULT_BASE_COLOR } from "../../constants";
import { isValidHex } from "../../utils/validation";
import ColorPicker from "../../components/ColorPicker";
import AppContext from "../../appContext";

export interface Props extends Omit<React.HTMLProps<HTMLElement>, "style"> {}

/**
 * Input field for main color
 */
const ColorInput = () => {
  const { hex, setHex, palette } = React.useContext(AppContext);
  const [inputValue, setInputValue] = React.useState(DEFAULT_BASE_COLOR);
  const [colorPickerAnchor, setColorPickerAnchor] =
    React.useState<HTMLElement | null>(null);
  const [, startTransition] = React.useTransition();

  React.useLayoutEffect(() => {
    window.addEventListener("message", (event: MessageEvent) => {
      if (event.data && event.data.pluginMessage) {
        const defaultColor =
          event.data.pluginMessage.lastSelectedColor || DEFAULT_BASE_COLOR;
        setHex(defaultColor);
        setInputValue(defaultColor);
      }
    });
  }, []);

  const handleInputValueChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (event) => {
    startTransition(() => {
      const cleanedValue = event.target.value.replace("#", "");
      setInputValue(`#${cleanedValue}`);
    });
  };

  React.useEffect(() => {
    if (isValidHex(inputValue)) {
      setHex(inputValue);
    }
  }, [inputValue]);

  const handleColorPickerClick: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    setColorPickerAnchor(event.currentTarget);
  };

  const handleColorPickerClose = () => {
    setHex(inputValue);
    setColorPickerAnchor(null);
  };

  const handleColorPickerChange: ColorChangeHandler = (color) => {
    startTransition(() => {
      setHex(color.hex);
    });
  };

  const handleColorPickerConfirm = (color: ColorResult) => {
    setInputValue(color.hex);
    setColorPickerAnchor(null);
  };

  return (
    <TextField
      variant="outlined"
      label="Base color"
      value={inputValue}
      onChange={handleInputValueChange}
      fullWidth
      error={!palette || !isValidHex(inputValue)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip title="Color picker" placement="bottom">
              <IconButton onClick={handleColorPickerClick} size="large">
                <ColorizeIcon />
              </IconButton>
            </Tooltip>

            <ColorPicker
              anchorEl={colorPickerAnchor}
              open={Boolean(colorPickerAnchor)}
              onClose={handleColorPickerClose}
              onChange={handleColorPickerChange}
              onConfirm={handleColorPickerConfirm}
              value={hex as string}
            />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default ColorInput;
