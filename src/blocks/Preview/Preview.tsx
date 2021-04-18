import * as React from "react";
import { COLORKEYS } from "../../constants";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { RgbHslHexObject } from "../../types";
import { getContrastRatio } from "../../utils/contrast";

interface Props {
  colorValue: string;
  paletteName: string;
  style?: React.CSSProperties; // too lazy to properly fix this
}

const useStyles = makeStyles((theme) => ({
  preview: {
    position: "relative",
    marginLeft: theme.spacing(2),
    maxWidth: 360,
  },

  previewScaled: {
    transform: "scale(0.7)",
    transformOrigin: "top",
  },

  previewCloned: {
    position: "absolute",
    filter: "blur(10px) brightness(125%) saturate(110%)",
    width: "100%",
    zIndex: -1,
    transform: "translate3d(2px, 6px, 0)",
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
}));

const Preview = ({ colorValue, paletteName, style, ...props }: Props) => {
  const classes = useStyles();
  let preview: RgbHslHexObject[];

  const colorKeys =
    preview.length < COLORKEYS.length ? COLORKEYS.slice(0, 9) : COLORKEYS;

  const previewPalette = colorKeys.reduce(
    (acc: object, curr: string, idx: number) => {
      acc[curr] = preview[idx].hex;

      if (curr === "400") {
        acc["500"] = colorValue;
      }

      return acc;
    },
    {}
  );

  // returns just #fff or #000 depending on contrast value
  const handleTextContrast = (hex: string): string => {
    return getContrastRatio("#ffffff", hex) < 6 ? "#000" : "#fff";
  };

  return (
    <div className={classes.previewScaled} style={style} {...props}>
      <div
        className={classes.previewSwatchHeader}
        style={{
          color: handleTextContrast(colorValue),
          backgroundColor: colorValue,
        }}
      >
        <Typography variant="body1">{paletteName}</Typography>

        <div>
          <Typography variant="body1">500</Typography>

          <Typography variant="body1">{colorValue}</Typography>
        </div>
      </div>

      {Object.entries(previewPalette).map(
        ([key, value]: [string, string], idx) => (
          <div
            className={classes.previewSwatch}
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
