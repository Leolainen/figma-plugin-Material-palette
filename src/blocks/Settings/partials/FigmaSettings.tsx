import * as React from "react";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
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
      <List dense ref={ref}>
        <ListSubheader>Figma</ListSubheader>

        <Divider />

        <ListItem>
          <ListItemText
            primary="Node type"
            secondary="What node type will be used as the root for the palette"
          />

          <TextField
            onChange={handleChange}
            select
            defaultValue={nodeType}
            fullWidth
          >
            <MenuItem value="component">Component</MenuItem>
            <MenuItem value="frame">Frame</MenuItem>
            <MenuItem value="rectangle">Rectangle</MenuItem>
          </TextField>
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Lock"
            secondary="The nodes that should be locked in the palete"
          />

          <TextField
            onChange={handleChange}
            select
            defaultValue={lock}
            fullWidth
          >
            <MenuItem value="everything">Everything</MenuItem>
            <MenuItem value="swatches">Swatches</MenuItem>
            <MenuItem value="nothing">Nothing</MenuItem>
          </TextField>
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Render with outlines"
            secondary="Draw an outline around the input color when created in Figma"
          />

          <Checkbox
            onChange={handleChange}
            name="renderWithOutline"
            defaultChecked={renderWithOutline}
          />
        </ListItem>
      </List>
    );
  }
);

FigmaSettings.displayName = "FigmaSettings";

export default FigmaSettings;
