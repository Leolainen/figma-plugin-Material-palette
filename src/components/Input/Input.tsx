import * as React from "react";
import "./styles.css";

type Props = {
  className?: string;
  label?: string;
};

const Input: React.FC<Props & React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  const { className, label, ...other } = props;

  return (
    <div className={`root ${className}`}>
      <label>{label}</label>

      <input className="input" {...other} />
    </div>
  );
};

Input.displayName = "Input";

export default Input;
