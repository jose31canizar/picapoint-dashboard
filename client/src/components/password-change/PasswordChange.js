import React, { Component } from "react";
import { auth } from "../../firebase";
import InputField, { byPropKey } from "../../items/input-field/InputField";
import Button from "../../items/button/Button";

const INITIAL_STATE = {
  passwordOne: "",
  passwordTwo: "",
  error: null,
  message: ""
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { passwordOne } = this.state;

    event.preventDefault();

    auth
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({
          ...INITIAL_STATE,
          message: "Your password has been reset."
        });
      })
      .catch(error => {
        this.setState(byPropKey("error", error));
      });
  };

  render() {
    const { passwordOne, passwordTwo, error, message } = this.state;

    const { authenticate, onSubmit } = this;

    const isInvalid = passwordOne !== passwordTwo || passwordOne === "";

    return (
      <section class="auth container">
        <h3>Change your password below</h3>
        <InputField
          value={passwordOne}
          label="New Password"
          field="passwordOne"
          setState={obj => this.setState(obj)}
          type="password"
          placeholder="New Password"
        />
        <InputField
          value={passwordTwo}
          label="Confirm"
          field="passwordTwo"
          setState={obj => this.setState(obj)}
          type="password"
          placeholder="Confirm New Password"
        />
        <Button
          disabled={isInvalid}
          action={e => onSubmit(e)}
          label="Reset my password"
        />

        {error && <p>{error.message}</p>}
        {message && <p>{message}</p>}
      </section>
    );
  }
}

export default PasswordChangeForm;
