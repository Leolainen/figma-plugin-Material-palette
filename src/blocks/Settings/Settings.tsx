import * as React from "react";
import Stack from "@mui/material/Stack";
import MaterialSettings from "./partials/MaterialSettings";
import FigmaSettings from "./partials/FigmaSettings";
import GeneralSettings from "./partials/GeneralSettings";
import LinearSettings from "./partials/LinearSettings";
import AppContext from "../../appContext";

interface Props {}

const Settings = React.forwardRef<HTMLUListElement, Props>((props, ref) => {
  const { schema } = React.useContext(AppContext);

  return (
    <Stack
      ref={ref}
      sx={{
        overflow: "auto",
        maxHeight: 550,

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
      {schema === "linear" && <LinearSettings />}
      {schema === "material" && <MaterialSettings />}
      <FigmaSettings />
      <GeneralSettings />
    </Stack>
  );
});

Settings.displayName = "Settings";

export default Settings;
