import * as React from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import Popover, { PopoverProps } from "@mui/material/Popover";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import { ChromePicker, ColorChangeHandler, ColorResult } from "react-color";

export interface Props {
  onConfirm: (color: ColorResult) => void;
  onClose: PopoverProps["onClose"];
  onChange?: ColorChangeHandler;
  anchorEl: PopoverProps["anchorEl"];
  open: PopoverProps["open"];
  value: string;
}

const ColorPicker = ({
  onConfirm,
  onChange,
  anchorEl,
  open,
  value,
  onClose,
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

      <Stack direction="row">
        <Button
          startIcon={<CloseIcon />}
          color="error"
          onClick={handleClose}
          fullWidth
        >
          Cancel
        </Button>
        <Button
          startIcon={<CheckIcon />}
          color="success"
          onClick={handleConfirm}
          fullWidth
        >
          Confirm
        </Button>
      </Stack>
    </Popover>
  );
};

export default ColorPicker;
