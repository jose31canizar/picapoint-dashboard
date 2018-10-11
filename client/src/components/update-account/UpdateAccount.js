import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./UpdateAccount.styl";
import * as routes from "../../constants/routes";
import { auth, db } from "../../firebase";
import InputField, { byPropKey } from "../../items/input-field/InputField";
import Button from "../../items/button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const INITIAL_STATE = {
  name: "",
  email: "",
  phone: "",
  branch: "",
  error: null,
  originalName: "",
  originalEmail: "",
  originalPhone: "",
  originalBranch: ""
};

class UpdateAccountForm extends Component {
  state = { ...INITIAL_STATE };

  update = event => {
    const { name, email, phone, branch } = this.state;

    event.preventDefault();

    //create a user in my own firebase database
    db.doUpdateUser({ name, email, phone, branch })
      .then(() => {
        this.setState({ originalPhone: phone, originalBranch: branch });
      })
      .catch(error => {
        console.log(error);
        this.setState(byPropKey("error", error));
      });
  };

  componentDidMount() {
    window.addEventListener("keypress", this.onEnter);

    db.loadAssetIfExists("name", name =>
      this.setState({ name, originalName: name })
    );
    db.loadAssetIfExists("email", email =>
      this.setState({ email, originalEmail: email })
    );
    db.loadAssetIfExists("phone", phone =>
      this.setState({ phone, originalPhone: phone })
    );
    db.loadAssetIfExists("branch", branch =>
      this.setState({ branch, originalBranch: branch })
    );
  }

  onEnter = e => {
    if (e.keyCode === 13) {
      this.update(e);
    }
  };

  componentWillUnmount() {
    window.removeEventListener("keypress", this.onEnter);
  }

  render() {
    const {
      name,
      email,
      phone,
      branch,
      originalName,
      originalEmail,
      originalPhone,
      originalBranch,
      error,
      attempted
    } = this.state;
    const isInvalid =
      phone === "" || branch === "" || email === "" || name === "";

    return (
      <section class="auth container">
        <h3>Update Account</h3>
        <InputField
          value={name}
          field="name"
          label="Name"
          type="text"
          placeholder="Full Name"
          setState={obj => this.setState(obj)}
          rightIcon={
            name === originalName ? (
              <FontAwesomeIcon icon="check" />
            ) : (
              <FontAwesomeIcon icon="times" />
            )
          }
        />
        <InputField
          value={email}
          field="email"
          label="Email"
          type="text"
          placeholder="Email Address"
          setState={obj => this.setState(obj)}
          rightIcon={
            email === originalEmail ? (
              <FontAwesomeIcon icon="check" />
            ) : (
              <FontAwesomeIcon icon="times" />
            )
          }
        />
        <InputField
          value={phone}
          type="text"
          field="phone"
          label="Phone"
          placeholder="Phone number"
          setState={obj => this.setState(obj)}
          rightIcon={
            phone === originalPhone ? (
              <FontAwesomeIcon icon="check" />
            ) : (
              <FontAwesomeIcon icon="times" />
            )
          }
        />
        <InputField
          value={branch}
          type="text"
          field="branch"
          label="Branch"
          placeholder="Enter your branch"
          setState={obj => this.setState(obj)}
          rightIcon={
            branch === originalBranch ? (
              <FontAwesomeIcon icon="check" />
            ) : (
              <FontAwesomeIcon icon="times" />
            )
          }
        />
        <Button
          action={this.update}
          label="Update account"
          disabled={isInvalid}
          attempt={e => {
            this.setState({ attempted: true });
            e.preventDefault();
          }}
        />

        {error && <p>{error.message}</p>}
        {isInvalid && attempted && <p>Invalid input 😔</p>}
      </section>
    );
  }
}

export default UpdateAccountForm;
