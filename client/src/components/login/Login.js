import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "./Login.styl";
import InputField, { byPropKey } from "../../items/input-field/InputField";
import Button from "../../items/button/Button";
import { SignUpLink } from "../signup/Signup";
import { HOME } from "../../constants/routes";
import { auth } from "../../firebase";
import { PasswordForgetLink } from "../password-forget/PasswordForget";
const LoginPage = ({ history }) => <Login history={history} />;

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

class Login extends Component {
  state = {
    ...INITIAL_STATE
  };
  authenticate = e => {
    const { history } = this.props;
    const { email, password } = this.state;

    e.preventDefault();
    fetch("http://localhost:9001/login", { body: { email, password } })
      .then(() => {
        this.setState({ ...INITIAL_STATE }, () => {
          history.push(HOME);
        });
      })
      .catch(error => {
        this.setState(byPropKey("error", error));
      });
  };
  componentDidMount() {
    window.addEventListener("keypress", this.onEnter);
  }

  onEnter = e => {
    if (e.keyCode === 13) {
      this.authenticate(e);
    }
  };

  componentWillUnmount() {
    window.removeEventListener("keypress", this.onEnter);
  }
  render() {
    const { email, password, error } = this.state;
    const { authenticate } = this;
    return (
      <section class="auth container">
        <h3>Merkevareportal</h3>
        <InputField
          value={email}
          field="email"
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
        <Button action={e => authenticate(e)} label="Logg Inn >>" />
        {error && <p>{error.message}</p>}
        <PasswordForgetLink />
        <SignUpLink />
      </section>
    );
  }
}

export default withRouter(LoginPage);
