import * as React from "react";
import Slider, { type SliderProps } from "@mui/material/Slider";
import { styled } from "@mui/material-pigment-css";

const ZoomSliderRoot = styled(Slider)(({ theme }) => ({
  margin: 0,
  margnTop: 2,
  marginLeft: 44,
  position: "absolute",
  right: 8,
  top: 64,
  opacity: 0.1,
  transition: `opacity ${theme.transitions.duration.shorter}ms ease`,

  "& .MuiSlider-markLabel": {
    left: -36, // inversed
  },

  "&:hover": {
    opacity: 1,
  },
}));

export const ZoomSlider = (props: SliderProps) => {
  return (
    <ZoomSliderRoot
      orientation="vertical"
      min={25}
      max={100}
      valueLabelDisplay="auto"
      marks={[
        {
          value: 25,
          label: "25%",
        },
        {
          value: 100,
          label: "100%",
        },
      ]}
      {...props}
    />
  );
};
