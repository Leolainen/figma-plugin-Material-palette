import * as React from "react";
import { Popover, PopoverProps } from "@mui/material";
import { ChromePicker, ColorChangeHandler } from "react-color";

export interface Props {
  onChange: ColorChangeHandler;
  onClose: PopoverProps["onClose"];
  anchorEl: PopoverProps["anchorEl"];
  open: PopoverProps["open"];
  value: string;
}

const ColorPicker = ({ onChange, anchorEl, open, value, onClose }: Props) => (
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
  >
    <ChromePicker onChange={onChange} color={value} />
  </Popover>
);

export default ColorPicker;
