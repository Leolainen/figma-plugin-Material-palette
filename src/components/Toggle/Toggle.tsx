import * as React from "react";
import {
  Tooltip,
  FormControlLabel,
  Switch,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

interface Props {
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
  name: string;
  checked: boolean;
  disabled: boolean;
  label: string;
  hint: string;
}

const useStyles = makeStyles(() => ({
  tooltip: {
    maxWidth: 225,
  },
}));

const Toggle = ({ onChange, name, checked, disabled, label, hint }: Props) => {
  const classes = useStyles();

  return (
    <Tooltip
      title={hint}
      placement="top"
      arrow
      classes={{ tooltip: classes.tooltip }}
    >
      <FormControlLabel
        control={<Switch checked={checked} onChange={onChange} name={name} />}
        disabled={disabled}
        label={<Typography variant="caption">{label}</Typography>}
        labelPlacement="bottom"
      />
    </Tooltip>
  );
};

export default Toggle;
