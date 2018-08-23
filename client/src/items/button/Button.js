import React from "react";
import "./Button.styl";

const Button = props => (
  <div class="button-wrapper" onMouseDown={props.attempt}>
    <button class="button" onMouseDown={props.action} disabled={props.disabled}>
      <label>{props.label}</label>
    </button>
  </div>
);
export default Button;
