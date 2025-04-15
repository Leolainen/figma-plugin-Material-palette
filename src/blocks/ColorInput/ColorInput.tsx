import * as React from "react";
import { ColorResult, ColorChangeHandler } from "react-color";
import { Colorize as ColorizeIcon } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { isValidHex } from "../../utils/validation";
import ColorPicker from "../../components/ColorPicker";
import { useAtom } from "jotai";
import * as atoms from "../../store";

export interface Props extends Omit<React.HTMLProps<HTMLElement>, "style"> {}

/**
 * Input field for main color
 */
const ColorInput = () => {
  const [hex, setHex] = useAtom(atoms.hex);
  const [palette, setPalette] = useAtom(atoms.palette);
  const [tempPalette, setTempPalette] = React.useState(palette);
  const [inputValue, setInputValue] = React.useState(hex);
  const [colorPickerAnchor, setColorPickerAnchor] =
    React.useState<HTMLElement | null>(null);
  const [, startTransition] = React.useTransition();

  const handleInputValueChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (event) => {
    const { value } = event.target;
    handleUpdate(value);
  };

  const handlePaste: React.ClipboardEventHandler<HTMLDivElement> | undefined = (
    event,
  ) => {
    const value = event.clipboardData.getData("test/plain");
    if (value) {
      handleUpdate(value);
    }
  };

  const handleUpdate = (value: string) => {
    const cleanedValue = value.replace("#", "");
    setInputValue(`#${cleanedValue}`);

    if (isValidHex(cleanedValue)) {
      setHex(value);
    }
  };

  const handleColorPickerClick: React.MouseEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    setTempPalette(palette);
    setColorPickerAnchor(event.currentTarget);
  };

  const handleColorPickerClose = () => {
    if (tempPalette) {
      setPalette(tempPalette);
    }

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
      label="Base color"
      value={inputValue}
      onChange={handleInputValueChange}
      onPaste={handlePaste}
      error={!palette || !isValidHex(inputValue)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip title="Color picker" placement="bottom">
              <IconButton onClick={handleColorPickerClick} edge="end">
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
