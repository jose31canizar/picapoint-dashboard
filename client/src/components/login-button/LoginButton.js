import React from "react";
import "./LoginButton.styl";

const LoginButton = props => (
  <div class="login-button" onMouseDown={props.action}>
    <label>{props.label}</label>
  </div>
);

export default LoginButton;
