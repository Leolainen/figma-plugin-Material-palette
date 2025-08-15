import * as React from "react";
import RestoreIcon from "@mui/icons-material/Restore";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import { useAtom } from "jotai";
import { defaultHCLMods } from "../../../constants";
import { findColorName } from "../../../utils";
import {
  hex as hexAtom,
  darkerModifiers as darkerModifiersAtom,
  lighterModifiers as lighterModifiersAtom,
  customHCLToggled as customHCLToggledAtom,
} from "../../../store";
import TabPanel from "../../../components/TabPanel";

const NaturalSettings = () => {
  const [hex] = useAtom(hexAtom);
  const [darkerModifiers, setDarkerModifiers] = useAtom(darkerModifiersAtom);
  const [lighterModifiers, setLighterModifiers] = useAtom(lighterModifiersAtom);
  const [, setCustomHCLToggled] = useAtom(customHCLToggledAtom);

  const colorName = findColorName(hex);

  // set defaults
  React.useEffect(() => {
    const defaultModifiers = defaultHCLMods[colorName];
    setCustomHCLToggled(true);

    setDarkerModifiers({
      ...defaultModifiers.darker,
    });
    setLighterModifiers({
      ...defaultModifiers.lighter,
    });
  }, [hex]);

  const handleModifierReset =
    (variance: "lighter" | "darker", key: "h" | "c" | "l") => () => {
      const defaultModifiers = defaultHCLMods[colorName];

      if (variance === "lighter") {
        setLighterModifiers({
          ...lighterModifiers,
          [key]: defaultModifiers.lighter[key],
        });
      } else {
        setDarkerModifiers({
          ...darkerModifiers,
          [key]: defaultModifiers.darker[key],
        });
      }
    };

  return (
    <TabPanel
      tabs={[
        {
          icon: <LightModeIcon />,
          label: "Lighter",
          content: (
            <Stack gap={2}>
              {(
                [
                  ["Hue", "h"],
                  ["Chroma", "c"],
                  ["Lightness", "l"],
                ] as const
              ).map(([label, key]) => (
                <TextField
                  fullWidth
                  label={label}
                  helperText={`Modifies the ${label} of swatches 50 - 400`}
                  type="number"
                  value={lighterModifiers[key]}
                  size="small"
                  onChange={(e) =>
                    setLighterModifiers({
                      ...lighterModifiers,
                      [key]: Number(e.target.value),
                    })
                  }
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Reset" placement="bottom">
                            <IconButton
                              onClick={handleModifierReset("lighter", key)}
                              edge="end"
                            >
                              <RestoreIcon />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              ))}
            </Stack>
          ),
        },
        {
          icon: <DarkModeIcon />,
          label: "Darker",
          content: (
            <Stack gap={2}>
              {(
                [
                  ["Hue", "h"],
                  ["Chroma", "c"],
                  ["Lightness", "l"],
                ] as const
              ).map(([label, key]) => (
                <TextField
                  fullWidth
                  label={label}
                  helperText={`Modifies the ${label} of swatches 50 - 400`}
                  type="number"
                  value={darkerModifiers[key]}
                  size="small"
                  onChange={(e) =>
                    setDarkerModifiers({
                      ...darkerModifiers,
                      [key]: Number(e.target.value),
                    })
                  }
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Reset" placement="bottom">
                            <IconButton
                              onClick={handleModifierReset("darker", key)}
                              edge="end"
                            >
                              <RestoreIcon />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              ))}
            </Stack>
          ),
        },
      ]}
    />
  );
};

export default NaturalSettings;
