import * as React from "react";
import { COLORKEYS, DEFAULT_BASE_COLOR } from "./constants";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  TextField,
  Select,
  Typography,
  InputAdornment,
  IconButton,
  InputLabel,
  FormControl,
  MenuItem,
} from "@material-ui/core";
import { generateMaterialPalette } from "./generators/material";
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
    height: "100%",
    display: "flex",
    justifyContent: "center",
  },

  buttons: {
    display: "flex",
    justifyContent: "flex-end",

    "& > button + button": {
      marginLeft: theme.spacing(2),
    },
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

const App: React.FC = () => {
  const classes = useStyles();
  const [inputValue, setInputValue] = React.useState(DEFAULT_BASE_COLOR);
  const [colorValue, setColorValue] = React.useState(inputValue);
  const [schema, setSchema] = React.useState(schemaOptions[0].value);
  const [paletteName, setPaletteName] = React.useState("");

  const debouncedValue = useDebounce(inputValue, 200);

  let preview: RgbHslHexObject[];
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

  // remove 5th idx of preview as it's the selected base color.
  // this is to keep preview array consistent regardless of palette
  if (preview.length) {
    preview.splice(5, 1);
  }

  const Preview = (props) => {
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

    return (
      <div className={classes.previewScaled} {...props}>
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

  return (
    <div className={classes.root}>
      <div className={classes.paletteSetup}>
        <Typography variant="h3" component="h1">
          Material Palette
        </Typography>

        <div className={classes.introduction}>
          <Typography variant="body2">1. Name your palette!</Typography>

          <Typography variant="body2">
            2. Type your base color or use the colorpicker!
          </Typography>

          <Typography variant="body2">3. Select a schema!</Typography>
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

        <FormControl variant="outlined" fullWidth>
          <InputLabel id="select-label">Schema</InputLabel>
          <Select
            labelId="select-label"
            onChange={handleSchemaChange}
            value={schema}
            label="Schema"
          >
            {schemaOptions.map((option) => (
              <MenuItem value={option.value}>{option.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className={classes.buttons}>
          <Button
            onClick={handleCancelClick}
            variant="contained"
            color="secondary"
          >
            Cancel
          </Button>

          <Button
            onClick={handleCreateClick}
            variant="contained"
            color="primary"
            disabled={!Boolean(preview)}
          >
            Create
          </Button>
        </div>
      </div>

      <div className={classes.preview}>
        {!preview ? (
          <>
            <Typography color="error" variant="h5">
              Whoops!!
            </Typography>

            <Typography color="error" variant="overline" paragraph>
              The material schema can't handle this color!
            </Typography>

            <Typography variant="body1" paragraph>
              The selected color is probably too dark or too bright.
            </Typography>

            <Typography variant="subtitle2">
              TIP: Slightly tweak your color or change to a monochrome schema.
            </Typography>
          </>
        ) : (
          <>
            <Preview />
            <Preview
              style={{
                position: "absolute",
                top: 0,
                filter: "blur(10px) brightness(125%) saturate(110%)",
                width: "100%",
                zIndex: -1,
                transform: "scale(0.7) translate3d(2px, 6px, 0)",
                opacity: 0.4,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
