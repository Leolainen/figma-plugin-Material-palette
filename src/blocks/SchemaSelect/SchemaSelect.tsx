import * as React from "react";
import { SelectChangeEvent } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Schema } from "../../types";
import AppContext from "../../appContext";

type SchemaOption = {
  label: string;
  value: Schema;
};

const schemaOptions: Array<SchemaOption> = [
  {
    value: "material",
    label: "Material",
  },
  {
    value: "monochrome",
    label: "Monochrome",
  },
  {
    value: "trueMonochrome",
    label: "True Monochrome",
  },
];

const SchemaSelect = () => {
  const { schema, setSchema } = React.useContext(AppContext);

  const handleSchemaChange = (event: SelectChangeEvent) => {
    setSchema(event.target.value as Schema);
  };

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel id="select-label">Schema</InputLabel>

      <Select
        labelId="select-label"
        onChange={handleSchemaChange}
        value={schema}
        label="Schema"
      >
        {schemaOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SchemaSelect;
