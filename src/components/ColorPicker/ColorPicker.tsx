import * as React from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import Popover, { PopoverProps } from "@mui/material/Popover";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import {
  ChromePicker,
  type ColorChangeHandler,
  type ColorResult,
} from "react-color";

export interface Props extends Omit<PopoverProps, "onChange"> {
  onConfirm: (color: ColorResult) => void;
  onChange?: ColorChangeHandler;
  value: string;
}

const ColorPicker = ({
  onConfirm,
  onChange,
  anchorEl,
  open,
  value,
  onClose,
  ...popoverProps
}: Props) => {
  const [selectedColor, setSelectedColor] = React.useState<ColorResult>();

  const handleChange: ColorChangeHandler = (color, event) => {
    setSelectedColor(color);

    if (onChange) {
      onChange(color, event);
    }
  };

  const handleConfirm: NonNullable<ButtonProps["onClick"]> = (event) => {
    if (!selectedColor) return;

    onConfirm(selectedColor);
  };

  const handleClose: NonNullable<ButtonProps["onClick"]> = (event) => {
    if (!onClose) return;

    onClose(event, "backdropClick"); // "reason" arg just to satisfy typescript
    setSelectedColor(undefined);
  };

  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "center",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "right",
      }}
      sx={{
        p: 1,
      }}
      {...popoverProps}
    >
      <ChromePicker
        onChange={handleChange}
        color={selectedColor?.hex || value}
        styles={{
          default: {
            picker: {
              boxShadow: "none",
            },
            body: {
              boxShadow: "none",
            },
          },
        }}
      />

      <Stack direction="row" mt={2}>
        <Button
          startIcon={<CloseIcon />}
          color="error"
          onClick={handleClose}
          size="small"
          fullWidth
        >
          Cancel
        </Button>
        <Button
          startIcon={<CheckIcon />}
          color="success"
          onClick={handleConfirm}
          size="small"
          fullWidth
        >
          Confirm
        </Button>
      </Stack>
    </Popover>
  );
};

export default ColorPicker;
