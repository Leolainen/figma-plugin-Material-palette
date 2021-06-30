import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import classnames from "classnames";
import { COLORKEYS } from "../../constants";
import { RgbHslHexObject, ColorKeys } from "../../types";
import { handleTextContrast } from "../../utils";

interface Props {
  colorValue: string;
  paletteName: string;
  preview: RgbHslHexObject[];
  style?: React.CSSProperties;
}

const useStyles = makeStyles(() => ({
  previewScaled: {
    transform: "scale(0.7)",
    transformOrigin: "top",
  },

  previewSwatchHeader: {
    height: 102,
    width: 360,
    display: "flex",
    flexDirection: "column",
    padding: 20,

    "& > div": {
      marginTop: "auto",
      display: "flex",
      justifyContent: "space-between",
      textTransform: "uppercase",
    },
  },

  previewSwatch: {
    width: 360,
    height: 14,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    textTransform: "uppercase",

    p: {
      fontSize: 18,
    },
  },

  mainSwatch: {
    border: "2px dashed white",
    padding: 18,
  },
}));

const Preview = ({
  colorValue,
  paletteName,
  preview,
  style,
  ...props
}: Props) => {
  const classes = useStyles();
  let colorKeys = [...COLORKEYS];

  // insert the 500 swatch which is missing from COLORKEYS
  colorKeys.splice(5, 0, "500");

  // remove keys for accents if there are none
  if (preview.length < COLORKEYS.length) {
    colorKeys = colorKeys.slice(0, 10);
  }

  const previewPalette = colorKeys.reduce((acc, curr: string, idx: number) => {
    try {
      acc[curr] = preview[idx].hex;
    } catch (e) {
      console.error("error", e);
      console.warn("idx,", idx);
    }

    return acc;
  }, {});

  return (
    <div className={classes.previewScaled} style={style} {...props}>
      <div
        className={classes.previewSwatchHeader}
        style={{
          color: handleTextContrast(previewPalette["500"]),
          backgroundColor: previewPalette["500"],
        }}
      >
        <Typography variant="body1">{paletteName}</Typography>

        <div>
          <Typography variant="body1">500</Typography>

          <Typography variant="body1">{previewPalette["500"]}</Typography>
        </div>
      </div>

      {Object.entries(previewPalette).map(
        ([key, value]: [ColorKeys, string], idx) => (
          <div
            className={classnames(classes.previewSwatch, {
              [classes.mainSwatch]: colorValue === value,
            })}
            style={{
              backgroundColor: value,
            }}
            key={`${colorValue}${idx}`}
          >
            <Typography
              variant="body2"
              style={{
                color: handleTextContrast(value),
              }}
            >
              {key}
            </Typography>

            <Typography
              variant="body2"
              style={{
                color: handleTextContrast(value),
              }}
            >
              {value}
            </Typography>
          </div>
        )
      )}
    </div>
  );
};

export default Preview;
