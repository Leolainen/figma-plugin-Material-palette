import * as React from "react";
import { COLORKEYS, DEFAULT_BASE_COLOR } from "./constants";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  Typography,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import {
  getSpecificLight,
  generateMaterialPalette,
} from "./generators/material";
import { generateMonochromePalette } from "./generators/monochrome";
import { RgbHslHexObject } from "./types";
import { hexToRGB } from "./converters/toRgb";
import { hexToHSL } from "./converters/toHsl";
import { getContrastRatio } from "./utils/contrast";
import { isValidHex } from "./utils/validation";
import useDebounce from "./hooks/useDebounce";

const schemaOptions = [
  {
    value: "material",
    label: "Material",
  },
  {
    value: "monochrome",
    label: "Monochrome",
  },
  {
    value: "trueMonochrome",
    label: "True Monochrome",
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },

  paletteSetup: {
    maxWidth: "50%",

    "& > * + *": {
      marginBottom: theme.spacing(3),
    },
  },

  baseColor: {},
  introduction: {},
  paletteName: {},
  colorPickerContainer: {},

  colorPicker: {
    cursor: "pointer",
    "-webkit-appearance": "button",
    background: "none",
    height: 50,
    border: "none",
    outline: "none",
    padding: 0,
  },

  preview: {
    marginLeft: theme.spacing(2),
    maxWidth: 360,
  },

  previewScaled: {
    transform: "scale(0.7)",
    transformOrigin: "top",
  },

  previewSwatchHeader: {
    height: 122,
    width: 360,
    display: "flex",
    flexDirection: "column",
    padding: 20,

    "& > div": {
      marginTop: "auto",
      display: "flex",
      justifyContent: "space-between",
    },
  },

  previewSwatch: {
    width: 360,
    height: 34,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
}));

const App: React.FC = () => {
  const classes = useStyles();
  const [inputValue, setInputValue] = React.useState(DEFAULT_BASE_COLOR);
  const [colorValue, setColorValue] = React.useState(inputValue);
  const [schema, setSchema] = React.useState(schemaOptions[0].value);
  const [paletteName, setPaletteName] = React.useState("");

  const debouncedValue = useDebounce(inputValue, 200);

  let preview;
  let baseColor: RgbHslHexObject = {
    rgb: hexToRGB(colorValue, true),
    hsl: hexToHSL(colorValue),
    hex: colorValue,
  };

  React.useEffect(() => {
    window.addEventListener("message", (event: MessageEvent) => {
      if (event.data && event.data.pluginMessage) {
        setInputValue(
          event.data.pluginMessage.lastSelectedColor || DEFAULT_BASE_COLOR
        );
      }
    });
  });

  React.useEffect(() => {
    if (isValidHex(debouncedValue)) {
      setColorValue(debouncedValue);
      baseColor = {
        rgb: hexToRGB(colorValue, true),
        hsl: hexToHSL(colorValue),
        hex: colorValue,
      };
    }
  }, [debouncedValue]);

  const handlePaletteNameChange = (e) => {
    setPaletteName(e.target.value);
  };

  const handleCreateClick = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "create-palette",
          schema: schema,
          value: colorValue,
          name: paletteName,
        },
      },
      "*"
    );
  };

  const handleCancelClick = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  const handleSchemaChange = (e) => {
    setSchema(e.target.value);
  };

  const handleinputValueChange = (e) => {
    setInputValue(e.target.value);
  };

  // returns just #fff or #000 depending on contrast value
  const handleTextContrast = (hex: string): string => {
    return getContrastRatio("#ffffff", hex) < 6 ? "#000" : "#fff";
  };

  switch (schema) {
    case "material":
      preview = generateMaterialPalette(baseColor);
      break;
    case "monochrome":
      preview = generateMonochromePalette(baseColor);
      break;
    case "trueMonochrome":
      preview = generateMonochromePalette(baseColor, true);
      break;
    default:
      console.error("no schema selected. This is impossible!");
  }

  return (
    <div className={classes.root}>
      <div className={classes.paletteSetup}>
        <Typography variant="h4" component="h1">
          Material Palette
        </Typography>

        <div className={classes.introduction}>
          <ol>
            <li>
              <Typography variant="body2">Name your palette!</Typography>
            </li>

            <li>
              <Typography variant="body2">
                Type your base color or use the colorpicker!
              </Typography>
            </li>

            <li>
              <Typography variant="body2">Select a schema!</Typography>
            </li>
          </ol>
        </div>

        <TextField
          className={classes.paletteName}
          label="Palette name"
          variant="outlined"
          onChange={handlePaletteNameChange}
          fullWidth
        />

        <TextField
          className={classes.baseColor}
          variant="outlined"
          label="Base color"
          value={inputValue}
          onChange={handleinputValueChange}
          fullWidth
          error={!Boolean(preview) || !isValidHex(debouncedValue)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <input
                    className={classes.colorPicker}
                    value={inputValue}
                    type="color"
                    onChange={handleinputValueChange}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Select
          label="Schema"
          onChange={handleSchemaChange}
          value={schema}
          variant="outlined"
          fullWidth
        >
          {schemaOptions.map((option) => (
            <MenuItem value={option.value}>{option.label}</MenuItem>
          ))}
        </Select>

        <div>
          <Button
            onClick={handleCreateClick}
            variant="contained"
            color="primary"
            disabled={!Boolean(preview)}
          >
            Create
          </Button>

          <Button
            onClick={handleCancelClick}
            variant="contained"
            color="secondary"
          >
            Cancel
          </Button>
        </div>
      </div>

      {!preview ? (
        <div className={classes.preview}>
          <Typography color="error" variant="h5">
            Whoops!!
          </Typography>

          <Typography color="error" variant="overline" paragraph>
            An error has occured when generating the preview.
          </Typography>

          <Typography variant="body1">
            The selected color is probably too dark or bright for the material
            schema!
          </Typography>

          <Typography variant="subtitle2">
            TIP: Either tweak your color or change to a monochrome schema.
          </Typography>

          <Typography variant="caption">
            [debug]: The "specific light" value of your color is:{" "}
            {getSpecificLight(colorValue)}
          </Typography>
        </div>
      ) : (
        <div className={classes.preview}>
          <div className={classes.previewScaled}>
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

            {preview.map((swatch, idx) => (
              <div
                className={classes.previewSwatch}
                style={{ backgroundColor: swatch.hex }}
                key={`${colorValue}${idx}`}
              >
                <Typography
                  variant="body2"
                  style={{
                    color: handleTextContrast(swatch.hex),
                  }}
                >
                  {idx === 5 ? "500" : COLORKEYS[idx]}
                </Typography>
                <Typography
                  variant="body2"
                  style={{
                    color: handleTextContrast(swatch.hex),
                  }}
                >
                  {swatch.hex}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
