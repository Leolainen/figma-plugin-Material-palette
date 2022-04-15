import * as React from "react";
import makeStyles from '@mui/styles/makeStyles';
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
  TextField,
  Typography,
  Popover,
  Tooltip,
} from "@mui/material";
import { Colorize as ColorizeIcon } from "@mui/icons-material";
import { ChromePicker } from "react-color";
import { DEFAULT_BASE_COLOR } from "./constants";
import { generateMaterialPalette } from "./generators/material";
import { generateMonochromePalette } from "./generators/monochrome";
import { ChromePickerColor, Palette, RgbHslHexObject } from "./types";
import { hexToRGB } from "./converters/toRgb";
import { hexToHSL } from "./converters/toHsl";
import { isValidHex } from "./utils/validation";
import useDebounce from "./hooks/useDebounce";
import Preview from "./blocks/Preview";
import Options from "./blocks/Options";
import PreviewError from "./blocks/PreviewError";

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

  options: {
    marginRight: "auto",
  },
}));

const extendColorModel = (hex: string): RgbHslHexObject => ({
  rgb: hexToRGB(hex, true),
  hsl: hexToHSL(hex),
  hex,
});

const defaultOptions = {
  lockSwatch: false,
  accent: true,
};

const accents = ["a100", "a200", "a400", "a700"] as const;

const Main: React.FC = () => {
  const classes = useStyles();
  const [paletteName, setPaletteName] = React.useState("");
  const [inputValue, setInputValue] = React.useState(DEFAULT_BASE_COLOR);
  const [hex, setHex] = React.useState(inputValue);
  const [schema, setSchema] = React.useState(schemaOptions[0].value);
  const [options, setOptions] = React.useState(defaultOptions);
  const [colorPickerAnchor, setColorPickerAnchor] = React.useState(null);
  const [palette, setPalette] = React.useState<Palette>();
  const [modifiedPalette, setModifiedPalette] = React.useState<Palette>();
  const [hasAccents, setHasAccents] = React.useState(false);

  const debouncedValue: string = useDebounce(inputValue, 200);

  React.useEffect(() => {
    window.addEventListener("message", (event: MessageEvent) => {
      if (event.data && event.data.pluginMessage) {
        setInputValue(
          event.data.pluginMessage.lastSelectedColor || DEFAULT_BASE_COLOR
        );
      }
    });
  }, []);

  React.useEffect(() => {
    setModifiedPalette(palette);
  }, [palette]);

  React.useEffect(() => {
    if (isValidHex(debouncedValue)) {
      setHex(debouncedValue);
    }
  }, [debouncedValue]);

  const handlePaletteNameChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setPaletteName(event.target.value);
  };

  const handleCreateClick = () => {
    if (!modifiedPalette) {
      console.error("Palette is missing!");
      return;
    }

    const postPalette = Object.values(modifiedPalette).map((swatchHex) =>
      extendColorModel(swatchHex)
    );

    parent.postMessage(
      {
        pluginMessage: {
          type: "create-palette",
          schema,
          palette: postPalette,
          value: hex,
          name: paletteName,
        },
      },
      "*"
    );
  };

  const handleCancelClick = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  const handleColorPickerClick: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    setColorPickerAnchor(event.currentTarget);
  };

  const handleColorPickerClose = () => {
    setColorPickerAnchor(null);
  };

  const handleSchemaChange = (event: SelectProps["onChange"]) => {
    setSchema(event.currentTarget.value);
  };

  const handleColorPickerChange = (color: ChromePickerColor) => {
    setInputValue(color.hex);
  };

  const handleInputValueChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (event) => {
    const cleanedValue = event.target.value.replace("#", "");

    setInputValue(`#${cleanedValue}`);
  };

  const handleOptionsChange = (newOptions: typeof options) => {
    setOptions(newOptions);
  };

  React.useEffect(() => {
    switch (schema) {
      case "material":
        setPalette(
          generateMaterialPalette(hex, {
            ...options,
          })
        );
        break;
      case "monochrome":
        setPalette(generateMonochromePalette(hex));
        break;
      case "trueMonochrome":
        setPalette(generateMonochromePalette(hex, true));
        break;
      default:
        console.error("no schema selected. This is impossible!");
    }
  }, [hex, options, schema]);

  React.useEffect(() => {
    if (palette) {
      const paletteClone = { ...palette };
      const foundAccents = accents.every((accent) => accent in paletteClone);

      if (foundAccents !== hasAccents) {
        setHasAccents(foundAccents);
      }

      // remove accents if material schema and accents is turned off
      if (foundAccents && !options.accent) {
        accents.forEach((accent) => delete paletteClone[accent]);

        setModifiedPalette(paletteClone);
      }
    }
  }, [hasAccents, options.accent, palette, setModifiedPalette]);

  const optionsDisabled = {
    lockSwatch: schema !== "material",
    accent: !hasAccents,
  };

  const handlePreviewChange = (previewPalette: Palette) => {
    setPalette(previewPalette);
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
          onChange={handleInputValueChange}
          fullWidth
          error={!palette || !isValidHex(debouncedValue)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Color picker" placement="bottom">
                  <IconButton onClick={handleColorPickerClick} size="large">
                    <ColorizeIcon />
                  </IconButton>
                </Tooltip>

                <Popover
                  anchorEl={colorPickerAnchor}
                  open={Boolean(colorPickerAnchor)}
                  onClose={handleColorPickerClose}
                  anchorOrigin={{
                    vertical: "center",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "center",
                    horizontal: "right",
                  }}
                >
                  <ChromePicker
                    onChange={handleColorPickerChange}
                    color={inputValue}
                  />
                </Popover>
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
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className={classes.buttons}>
          <Options
            options={options}
            optionsDisabled={optionsDisabled}
            onOptionsChange={handleOptionsChange}
            className={classes.options}
          />

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
            disabled={!palette}
          >
            Create
          </Button>
        </div>
      </div>

      <div className={classes.preview}>
        {!palette || !modifiedPalette || !hex || !isValidHex(hex) ? (
          <PreviewError />
        ) : (
          <Preview
            preview={modifiedPalette}
            paletteName={paletteName}
            colorValue={hex}
            onPaletteChange={handlePreviewChange}
          />
        )}
      </div>
    </div>
  );
};

export default Main;
