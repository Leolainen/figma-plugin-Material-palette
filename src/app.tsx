import * as React from "react";
import "./ui.css";
import Button from "./components/Button";
import Checkbox from "./components/Checkbox";
import Input from "./components/Input";
import Select from "./components/Select";

console.log("ui");

const schemaOptions = [
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

type Props = {
  className?: string;
};

const App: React.FC<Props> = () => {
  textbox: HTMLInputElement;
  console.log("app");
  const [colorValue, setColorValue] = React.useState('#ffffff');
  const [schema, setSchema] = React.useState(schemaOptions[0].value)
  const [paletteName, setPaletteName] = React.useState("");
  const [colorPickerToggled, setColorPickerToggled] = React.useState(false);

  const handleColorPickerChange = () => {
    setColorPickerToggled(!colorPickerToggled);
  };

  const handlePaletteNameChange = (e) => {
    console.log("handlePaletteNameChange", e);
    setPaletteName(e.target.value);
  };

  const handleCreateClick = () => {
    // parent.postMessage({
    //       pluginMessage: {
    //         type: 'create-palette',
    //         schema: schema,
    //         value: colorInput.value,
    //         name: paletteName,
    //       }
    //     }, '*')
    console.log("handleCreateClick");
  };

  const handleCancelClick = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  const handleSchemaChange = (e) => {
    setSchema(e.target.value);
  };

  const handleColorValueChange = e => {
    setColorValue(e.target.value);
  }

  // onCreate = () => {
  //   const count = parseInt(this.textbox.value, 10)
  //   parent.postMessage({ pluginMessage: { type: 'create-rectangles', count } }, '*')
  // }

  // onCancel = () => {
  //   parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
  // }

  return (
    <div>
      <h2>Material Palette</h2>

      <div className="outer-wrapper">
        <div className="info-text">
          <h3>Material palette</h3>

          <ol>
            <li>Give your palette a name!</li>

            <li>Select a color to act as the base for your palette!</li>

            <li>
              Choose either the Material Design schema for your palette or a
              monochromatic one!
            </li>
          </ol>
        </div>

        <Input
          label="Palette name"
          type="text"
          placeholder="Palette name"
          onChange={handlePaletteNameChange}
        />

        <div className="input-wrapper toggle-wrapper">
          <Checkbox
            label="Toggle color picker"
            onChange={handleColorPickerChange}
            checked={colorPickerToggled}
          />
        </div>

        <div className="input-wrapper">
          <label>Base color:</label>

          <Input
            className="color-input"
            label="Color"
            value={colorValue}
            type={colorPickerToggled ? "color" : "text"}
            onChange={handleColorValueChange}
          />
        </div>

        <Select
          label="Schema"
          options={schemaOptions}
          onChange={handleSchemaChange}
        />

        <p id="error-msg" style={{ color: "darkred" }} />

        <div>
          <Button onClick={handleCreateClick} id="create">
            Create
          </Button>

          <Button onClick={handleCancelClick} id="cancel">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default App;
