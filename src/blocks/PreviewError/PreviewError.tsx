import * as React from "react";
import { Typography } from "@mui/material";

/**
 * Just a bunch of text
 */
const PreviewError = () => (
  <>
    <Typography color="error" variant="h5">
      Whoops!!
    </Typography>

    <Typography color="error" variant="overline" paragraph>
      The material schema can't handle this color!
    </Typography>

    <Typography variant="body1" paragraph>
      The selected color is probably too dark or too bright.
    </Typography>

    <Typography variant="subtitle2">
      TIP: Slightly tweak your color or change to a monochrome schema.
    </Typography>
  </>
);

export default PreviewError;
