import React from "react";
import "./InputField.styl";
const InputField = props => (
  <div class="input-field-container">
    <span>{props.label}</span>
    <input placeholder={props.placeholder} class="input-field" />
  </div>
);

export default InputField;
