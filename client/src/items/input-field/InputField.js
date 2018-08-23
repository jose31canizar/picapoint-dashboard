import React from "react";
import "./InputField.styl";
const InputField = ({ value, field, type, label, placeholder, setState }) => (
  <div class="input-field-container">
    <span>{label}</span>
    <input
      class="input-field"
      value={value}
      onChange={event => setState(byPropKey(field, event.target.value))}
      type={type}
      placeholder={placeholder}
    />
  </div>
);

export const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

export default InputField;
