import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "./Login.styl";
import InputField, { byPropKey } from "../../items/input-field/InputField";
import Button from "../../items/button/Button";
import { SignUpLink } from "../signup/Signup";
import { HOME } from "../../constants/routes";
import { auth } from "../../firebase";
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
    console.log("authenticating...");
    console.log(email);
    console.log(password);
    auth
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        history.push(HOME);
      })
      .catch(error => {
        this.setState(byPropKey("error", error));
      });
    e.preventDefault();
  };
  render() {
    const { email, password, error } = this.state;
    const { authenticate } = this;
    return (
      <div className="page login">
        <section class="container">
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
          <Link to="forgot-password">Glemt passord?</Link>
          <SignUpLink />
        </section>
      </div>
    );
  }
}

export default withRouter(LoginPage);
