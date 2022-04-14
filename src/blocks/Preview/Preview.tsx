import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ButtonBase, Typography } from "@material-ui/core";
import classnames from "classnames";
import { Palette, ColorKeys, ChromePickerColor } from "../../types";
import { handleTextContrast } from "../../utils";
import ColorPicker from "../../components/ColorPicker";

interface Props {
  colorValue: string;
  paletteName: string;
  preview: Palette;
  onPaletteChange: (palette: Palette) => void;
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
    cursor: "pointer",

    p: {
      fontSize: 18,
    },

    "&:hover": {
      outline: "3px solid hsla(150, 60%, 50%, 0.7)",
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
  onPaletteChange,
  ...props
}: Props) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const selectedSwatch = React.useRef("");

  const handleSwatchClick = (swatch) => (event) => {
    selectedSwatch.current = swatch;
    setAnchorEl(event.currentTarget);
  };

  const handleColorChange = (color: ChromePickerColor) => {
    const swatch = Object.keys(selectedSwatch.current)[0];

    if (!swatch) {
      console.error("no swatch was found");
      return;
    }

    const newPalette: Palette = { ...preview };
    newPalette[swatch] = color.hex;

    onPaletteChange(newPalette);
    setAnchorEl(null);
  };

  if (!preview) {
    return <p>loading palette</p>;
  }

  return (
    <div className={classes.previewScaled} style={style} {...props}>
      <div
        className={classes.previewSwatchHeader}
        style={{
          color: handleTextContrast(preview["500"]),
          backgroundColor: preview["500"],
        }}
      >
        <Typography variant="body1">{paletteName}</Typography>

        <div>
          <Typography variant="body1">500</Typography>

          <Typography variant="body1">{preview["500"]}</Typography>
        </div>
      </div>

      {Object.entries(preview).map(
        ([swatchKey, value]: [ColorKeys, string], idx) => (
          <React.Fragment key={swatchKey + value}>
            <ColorPicker
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              onChange={handleColorChange}
              value={Object.values(selectedSwatch.current)[0]}
            />

            <ButtonBase
              className={classnames(classes.previewSwatch, {
                [classes.mainSwatch]: colorValue === value,
              })}
              style={{
                backgroundColor: value,
              }}
              key={`${colorValue}${idx}`}
              onClick={handleSwatchClick({ [swatchKey]: value })}
            >
              <Typography
                variant="body2"
                style={{
                  color: handleTextContrast(value),
                }}
              >
                {swatchKey}
              </Typography>

              <Typography
                variant="body2"
                style={{
                  color: handleTextContrast(value),
                }}
              >
                {value}
              </Typography>
            </ButtonBase>
          </React.Fragment>
        )
      )}
    </div>
  );
};

export default Preview;
