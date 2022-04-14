import * as React from "react";
import { ChromePicker } from "react-color";
import { Popover, PopoverProps } from "@material-ui/core";
import { ChromePickerColor } from "../../types";

export interface Props {
  onChange: (color: ChromePickerColor) => void;
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
