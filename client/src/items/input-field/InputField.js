import React from "react";
import "./InputField.styl";
const InputField = ({
  value,
  field,
  type,
  label,
  placeholder,
  setState,
  rightIcon
}) => (
  <div class="input-field-container">
    <span>{label}</span>
    <input
      tabIndex="-1"
      class="input-field"
      value={value}
      onChange={event => setState(byPropKey(field, event.target.value))}
      type={type}
      placeholder={placeholder}
    />
    {rightIcon}
  </div>
);

export const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

export default InputField;
