import * as React from "react";
import "./styles.css";

type Props = {
  className?: string;
  label?: string;
};

const Checkbox: React.FC<Props & React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  const { className, label, ...other } = props;

  return (
    <div className={`root ${className}`}>
      <input className="checkbox" type="checkbox" {...other} />

      <label>{label}</label>
    </div>
  );
};

Checkbox.displayName = "Checkbox";

export default Checkbox;
