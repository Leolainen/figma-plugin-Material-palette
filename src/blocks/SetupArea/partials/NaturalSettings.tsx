import * as React from "react";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import { useAtom } from "jotai";
import { defaultHCLMods } from "../../../constants";
import { findColorName } from "../../../utils";
import {
    hex as hexAtom,
    darkerModifiers as darkerModifiersAtom,
    lighterModifiers as lighterModifiersAtom,
    customHCLToggled as customHCLToggledAtom,
} from "../../../store";

const NaturalSettings = () => {
    const [hex] = useAtom(hexAtom);
    const [darkerModifiers, setDarkerModifiers] = useAtom(darkerModifiersAtom);
    const [lighterModifiers, setLighterModifiers] = useAtom(lighterModifiersAtom);
    const [customHCLToggled, setCustomHCLToggled] = useAtom(customHCLToggledAtom);
    const colorName = findColorName(hex);

    // set defaults
    React.useEffect(() => {
        const defaultModifiers = defaultHCLMods[colorName];

        if (!customHCLToggled) {
            setDarkerModifiers({
                ...defaultModifiers.darker,
            });
            setLighterModifiers({
                ...defaultModifiers.lighter,
            });
        }
    }, [customHCLToggled, hex]);

    return (
        <Grid container>
            <Grid item xs={6}>
                <Box>
                    <Typography>Custom values</Typography>

                    <Typography variant="overline" color="text.secondary">
                        Toggle custom HCL modifiers
                    </Typography>
                </Box>
            </Grid>

            <Grid item xs={6}>
                <Switch
                    checked={customHCLToggled}
                    onChange={(e) => setCustomHCLToggled(e.target.checked)}
                />
            </Grid>

            <Grid item xs={6}>
                <Box>
                    <Typography>Lighter modifiers</Typography>

                    <Typography variant="overline" color="text.secondary">
                        {colorName}
                    </Typography>
                </Box>
            </Grid>

            <Grid item xs={6}>
                <Stack direction="row" spacing={1}>
                    {Object.entries(lighterModifiers).map(([key, value]) => (
                        <TextField
                            key={`lighterModifiers-${key}-${value}`}
                            disabled={!customHCLToggled}
                            sx={{
                                "& .MuiInputBase-root": {
                                    width: "7ch",
                                },
                            }}
                            type="number"
                            value={lighterModifiers[key as keyof typeof lighterModifiers]}
                            onChange={(e) =>
                                setLighterModifiers({
                                    ...lighterModifiers,
                                    [key]: Number(e.target.value),
                                })
                            }
                        />
                    ))}
                </Stack>
            </Grid>

            <Grid item xs={6}>
                <Box>
                    <Typography>Darker modifiers </Typography>
                    <Typography variant="overline" color="text.secondary">
                        {colorName}
                    </Typography>
                </Box>
            </Grid>

            <Grid item xs={6}>
                <Stack direction="row" spacing={1}>
                    {Object.entries(darkerModifiers).map(([key, value]) => (
                        <TextField
                            disabled={!customHCLToggled}
                            key={`darkerModifiers-${key}-${value}`}
                            sx={{
                                "& .MuiInputBase-root": {
                                    width: "7ch",
                                },
                            }}
                            type="number"
                            value={darkerModifiers[key as keyof typeof darkerModifiers]}
                            onChange={(e) =>
                                setDarkerModifiers({
                                    ...darkerModifiers,
                                    [key]: Number(e.target.value),
                                })
                            }
                        />
                    ))}
                </Stack>
            </Grid>
        </Grid>
    );
};

export default NaturalSettings;
