import * as React from "react";
import makeStyles from '@mui/styles/makeStyles';
import { IconButton, Popover, Tooltip } from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import Toggle from "../../components/Toggle";

type OptionsType = {
  lockSwatch: boolean;
  accent: boolean;
};

interface Props {
  className?: string;
  options: OptionsType;
  optionsDisabled: OptionsType;
  onOptionsChange: (options: OptionsType) => void;
}

const useStyles = makeStyles(() => ({
  popover: {
    padding: 16,
    display: "grid",
    gridTemplateRows: "auto",
    gridTemplateColumns: "repeat(3, 1fr)",
  },
}));

const Options: React.FC<Props> = ({
  className,
  onOptionsChange,
  options,
  optionsDisabled,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    if (event.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onOptionsChange({
        ...options,
        [event.target.name]: event.target.checked,
      });
    },
    [onOptionsChange, options]
  );

  return <>
    <Tooltip title="Options" placement="bottom">
      <IconButton className={className} onClick={handleClick} size="large">
        <SettingsIcon />
      </IconButton>
    </Tooltip>

    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "center",
        horizontal: "right",
      }}
      classes={{ paper: classes.popover }}
      onClose={handleClose}
      open={open}
      transformOrigin={{
        vertical: "center",
        horizontal: "left",
      }}
    >
      <Toggle
        checked={options.accent}
        onChange={handleChange}
        name="accent"
        disabled={optionsDisabled.accent}
        label="Accent colors"
        hint="Toggles the accent colors on or off (material only)"
      />

      <Toggle
        checked={options.lockSwatch}
        onChange={handleChange}
        name="lockSwatch"
        disabled={optionsDisabled.lockSwatch}
        label="Lock swatch"
        hint="Locks the input value to swatch 500 when toggled on (material only)"
      />
    </Popover>
  </>;
};

export default Options;
