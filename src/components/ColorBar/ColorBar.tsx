import * as React from "react";
import ButtonBase, { ButtonBaseProps } from "@mui/material/ButtonBase";
import TouchRipple, {
  TouchRippleActions,
} from "@mui/material/ButtonBase/TouchRipple";
import { Palette } from "../../types";
import { handleTextContrast } from "../../utils";
import { useAtom } from "jotai";
import * as atoms from "../../store";

type Swatch = [swatchKey: keyof Palette, hex: string];

export interface Props extends Omit<ButtonBaseProps, "onClick"> {
  /**
   * A swatch from the `Palette` object
   *
   * @example
   * ```
   * ["500", "#1A3CAA"]
   * ```
   */
  swatch: Swatch;
  onClick: (
    swatch: Swatch,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
}

/**
 * A single color bar used to represent a swatch in the color palette
 */
const ColorBar = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { onClick, swatch, sx, ...other } = props;
  const rippleRef = React.useRef<TouchRippleActions>(null);
  const [colorBarWidth] = useAtom(atoms.colorBarWidth);
  const [colorBarHeight] = useAtom(atoms.colorBarHeight);

  const handleClick: ButtonBaseProps["onClick"] = (event) => {
    onClick(swatch, event);
  };

  const handleMouseEnter: ButtonBaseProps["onMouseEnter"] = (event) => {
    if (rippleRef.current) {
      // rippleRef.current.pulsate(event);
      rippleRef.current.start(event, {
        // center: true,
        center: false,
        pulsate: false,
      });
    }
  };

  const handleMouseLeave: ButtonBaseProps["onMouseLeave"] = (event) => {
    if (rippleRef.current) {
      rippleRef.current.stop(event);
    }
  };

  const [swatchKey, hex] = swatch;

  return (
    <ButtonBase
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        width: colorBarWidth,
        height: colorBarHeight,
        px: 2,
        bgcolor: hex,
        display: "flex",
        flexDirection: colorBarWidth < 150 ? "column" : "row",
        justifyContent: "space-between",
        alignItems: "center",
        color: handleTextContrast(hex),
        typography: "button",
        ...sx,
      }}
      onClick={handleClick}
      {...other}
    >
      <span>{swatchKey}</span>
      <span>{hex}</span>

      <TouchRipple ref={rippleRef} />
    </ButtonBase>
  );
});

ColorBar.displayName = "ColorBar";

export default ColorBar;
