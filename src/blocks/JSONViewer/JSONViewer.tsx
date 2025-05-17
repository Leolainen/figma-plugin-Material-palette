import * as React from "react";
import CloseIcon from "@mui/icons-material/Close";
import DataObjectIcon from "@mui/icons-material/DataObject";
import DownloadIcon from "@mui/icons-material/Download";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useAtom } from "jotai";
import * as atoms from "../../store";

export function JSONViewer() {
  const [open, setOpen] = React.useState(false);
  const [palette] = useAtom(atoms.palette);
  const [paletteName] = useAtom(atoms.paletteName);
  const [hex] = useAtom(atoms.hex);

  const handleOpen = () => {
    console.log("click");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(palette, null, 2)], {
      type: "application/json",
    });

    const a = document.createElement("a");
    a.download = `${paletteName || hex}.json`;
    a.href = URL.createObjectURL(blob);
    a.textContent = "Download";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <Tooltip title="View JSON data" placement="bottom">
        <Button onClick={handleOpen}>
          <DataObjectIcon />
        </Button>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              maxWidth: "none",
              maxHeight: "none",
              width: "auto",
            },
          },
        }}
      >
        <Tooltip title="Close" placement="top">
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 12 }}
            edge="end"
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>

        <DialogContent sx={{ py: 4, px: 8 }}>
          <pre style={{ outline: "1px dashed grey", padding: 8 }}>
            {JSON.stringify(palette, null, 4)}
          </pre>
        </DialogContent>

        <Divider />

        <DialogActions>
          <Button
            startIcon={<CloseIcon />}
            color="error"
            onClick={handleClose}
            size="small"
            fullWidth
          >
            Close
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            color="success"
            onClick={handleDownload}
            size="small"
            fullWidth
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
