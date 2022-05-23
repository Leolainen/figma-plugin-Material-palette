import * as React from "react";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import FigmaSettings from "./partials/FigmaSettings";
import GeneralSettings from "./partials/GeneralSettings";
import { useAtom } from "jotai";
import * as atoms from "../../store";

interface Props {}

const Settings = React.forwardRef<HTMLUListElement, Props>((props, ref) => {
  const [, setSettings] = useAtom(atoms.settingsAtom);
  const [showResetDialog, setShowResetDialog] = React.useState(false);

  const openResetDialog = () => setShowResetDialog(true);
  const closeResetDialog = () => setShowResetDialog(false);

  const handleReset = () => {
    setSettings(atoms.defaultSettings);
    closeResetDialog();
  };

  return (
    <>
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
              secondary="Restore all settings back to default"
            />

            <Button onClick={openResetDialog}>Reset</Button>
          </ListItem>
        </List>
      </Stack>

      <Dialog open={showResetDialog} onClose={closeResetDialog}>
        <DialogTitle>Reset settings</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reset all settings back to default?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeResetDialog}>Cancel</Button>
          <Button onClick={handleReset}>Reset</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

Settings.displayName = "Settings";

export default Settings;
