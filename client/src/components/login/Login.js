import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Login.styl";
import InputField from "../../items/input-field/InputField";
import Button from "../../items/button/Button";
import { SignUpLink } from "../signup/Signup";

export default class Login extends Component {
  state = {
    username: "",
    password: ""
  };
  render() {
    const { authenticate } = this.props;
    console.log(authenticate.toString());
    const { username, password } = this.state;
    return (
      <div className="page login">
        <section class="container">
          <h3>Merkevareportal</h3>
          <InputField
            value={username}
            field="username"
            label="Brukernavn"
            type="text"
            placeholder="Din e-post-adresse"
            setState={obj => this.setState(obj)}
          />
          <InputField
            value={password}
            field="password"
            label="Passord"
            type="password"
            placeholder="Passord"
            setState={obj => this.setState(obj)}
          />
          <Button
            action={() => authenticate(username, password)}
            label="Logg Inn >>"
          />
          <Link to="forgot-password">Glemt passord?</Link>
          <SignUpLink />
        </section>
      </div>
    );
  }
}
