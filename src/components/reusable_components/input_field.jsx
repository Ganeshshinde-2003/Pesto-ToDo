import React from "react";
import "../../pages/auth/forms.css";

const InputField = ({ label, type, value, onChange, required, rows, name }) => (
  <div className="input-wrapper">
    <label>{label}</label>
    {type === "textarea" ? (
      <textarea
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        name={name}
      />
    ) : (
      <input type={type} value={value} onChange={onChange} required={required} name={name} />
    )}
  </div>
);

export default InputField;
