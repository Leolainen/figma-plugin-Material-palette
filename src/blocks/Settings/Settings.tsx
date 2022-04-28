import * as React from "react";
import Stack from "@mui/material/Stack";
import MaterialSettings from "./partials/MaterialSettings";
import FigmaSettings from "./partials/FigmaSettings";
import GeneralSettings from "./partials/GeneralSettings";
import LinearSettings from "./partials/LinearSettings";

interface Props {}

const Settings = React.forwardRef<HTMLUListElement, Props>((props, ref) => {
  return (
    <Stack
      ref={ref}
      sx={{
        overflow: "auto",
        maxHeight: 550,

        "& li > div:first-child": {
          flex: "70%",
        },
        "& li > div:last-child": {
          maxWidth: "30%",
          pl: 2,
        },
      }}
    >
      <MaterialSettings />
      <LinearSettings />
      <FigmaSettings />
      <GeneralSettings />
    </Stack>
  );
});

Settings.displayName = "Settings";

export default Settings;
