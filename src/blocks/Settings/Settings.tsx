import * as React from "react";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FigmaSettings from "./partials/FigmaSettings";
import GeneralSettings from "./partials/GeneralSettings";
import { useAtom } from "jotai";
import * as atoms from "../../store";

interface Props {}

const Settings = React.forwardRef<HTMLUListElement, Props>((props, ref) => {
  const [, setSettings] = useAtom(atoms.settingsAtom);

  const handleReset = () => {
    setSettings(atoms.defaultSettings);
  };

  return (
    <Stack ref={ref}>
      <List
        dense
        ref={ref}
        sx={{
          "& li > div:first-child": {
            flex: "70%",
            maxWidth: "65%",
          },
          "& li > *:last-child": {
            maxWidth: "30%",
            ml: "auto",
          },
        }}
      >
        <FigmaSettings />
        <GeneralSettings />

        <Divider />

        <ListItem disableGutters>
          <ListItemText
            primary="Reset settings"
            secondary="Restore settings back to default"
          />

          <Button onClick={handleReset}>Reset</Button>
        </ListItem>
      </List>
    </Stack>
  );
});

Settings.displayName = "Settings";

export default Settings;
