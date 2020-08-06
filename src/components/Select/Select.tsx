import * as React from "react";
import "./styles.css";

type Options = {
  label: string;
  value: string | number;
};

type Props = {
  className?: string;
  label?: string;
  options: Array<Options>
};

const Select: React.FC<Props & React.HTMLAttributes<HTMLSelectElement>> = (props) => {
  const { className, label, options, ...other } = props;

  return (
    <div className={`root ${className}`}>
      <label>{label}</label>

      <select {...other}>
        {options.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

Select.displayName = "Select";

export default Select;
