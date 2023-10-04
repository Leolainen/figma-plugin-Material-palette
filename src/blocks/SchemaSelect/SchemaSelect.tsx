import * as React from "react";
import { SelectChangeEvent } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Schema } from "../../types";
import { useAtom } from "jotai";
import * as atoms from "../../store";

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
    value: "linear",
    label: "Linear",
  },
  {
    value: "natural",
    label: "Natural",
  },
];

const SchemaSelect = () => {
  const [schema, setSchema] = useAtom(atoms.schemaAtom);

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
