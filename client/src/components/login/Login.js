import React, { Component } from "react";
import "./Login.styl";
import "../assets/InputButton.styl";

export default class Login extends Component {
  render() {
    return (
      <div class="login" style={this.props.style}>
        <input placeholder="login" class="input-button" />
        <input placeholder="signup" class="input-button" />
      </div>
    );
  }
}
