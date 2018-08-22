import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Login.styl";
import InputField from "../../items/input-field/InputField";
import LoginButton from "../login-button/LoginButton";

export default class Login extends Component {
  state = {
    username: "",
    password: ""
  };
  updateField(text, type) {
    this.setState({
      [type]: text
    });
  }
  render() {
    const { authenticate } = this.props;
    console.log(authenticate.toString());
    const { username, password } = this.state;
    return (
      <div className="page login">
        <section class="login-container">
          <h3>Merkevareportal</h3>
          <InputField
            onChange={text => this.updateField(text, "username")}
            placeholder="Din e-post-adresse"
            label="Brukernavn"
          />
          <InputField
            onChange={text => this.updateField(text, "password")}
            placeholder="Passord"
            label="Passord"
          />
          <LoginButton
            action={() => authenticate(username, password)}
            label="Logg Inn >>"
          />
          <Link to="forgot-password">Glemt passord?</Link>
        </section>
      </div>
    );
  }
}
