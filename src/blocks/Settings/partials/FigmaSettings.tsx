import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import { useAtom } from "jotai";
import * as atoms from "../../../store";
import * as SettingsTypes from "../../../store/types/settings";

interface Props {}

const FigmaSettings = React.forwardRef<HTMLUListElement, Props>(
  (props, ref) => {
    const [renderWithOutline, setRenderWithOutline] = useAtom(
      atoms.renderWithOutlineAtom
    );
    const [lock, setLock] = useAtom(atoms.lockAtom);
    const [nodeType, setNodeType] = useAtom(atoms.nodeTypeAtom);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let value;

      if (event.target.type === "checkbox") {
        value = event.target.checked;
      } else {
        value = event.target.value;
      }

      switch (event.target.name) {
        case "renderWithOutline":
          setRenderWithOutline(value as boolean);
          break;
        case "lock":
          setLock(value as SettingsTypes.Lock);
          break;
        case "nodeType":
          setNodeType(value as SettingsTypes.NodeType);
          break;
        default:
          break;
      }
    };

    return (
      <>
        <ListItem disableGutters>
          <ListItemText
            primary="Node type"
            secondary="The node type of the palette"
          />

          <TextField
            onChange={handleChange}
            select
            value={nodeType}
            fullWidth
            name="nodeType"
          >
            <MenuItem value="component">Component</MenuItem>
            <MenuItem value="frame">Frame</MenuItem>
          </TextField>
        </ListItem>

        <ListItem disableGutters>
          <ListItemText
            primary="Lock"
            secondary="The nodes that should be locked"
          />

          <TextField
            onChange={handleChange}
            select
            value={lock}
            fullWidth
            name="lock"
          >
            <MenuItem value="everything">Everything</MenuItem>
            <MenuItem value="swatches">Swatches</MenuItem>
            <MenuItem value="nothing">Nothing</MenuItem>
          </TextField>
        </ListItem>

        <ListItem disableGutters>
          <ListItemText
            primary="Render with outlines"
            secondary="Add an outline to the input color node"
          />

          <Checkbox
            onChange={handleChange}
            name="renderWithOutline"
            checked={renderWithOutline}
          />
        </ListItem>
      </>
    );
  }
);

FigmaSettings.displayName = "FigmaSettings";

export default FigmaSettings;
