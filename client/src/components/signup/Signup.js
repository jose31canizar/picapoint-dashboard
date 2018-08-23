import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "./Signup.styl";
import { HOME } from "../../constants/routes";
import { auth } from "../../firebase";
import InputField, { byPropKey } from "../../items/input-field/InputField";
import Button from "../../items/button/Button";

const SignUpPage = ({ history }) => <SignUpForm history={history} />;

const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null,
  attempted: false
};

class SignUpForm extends Component {
  state = { ...INITIAL_STATE };

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;
    console.log(email);
    console.log(passwordOne);
    const { history } = this.props;

    auth
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        history.push(HOME);
      })
      .catch(error => {
        console.log(error);
        this.setState(byPropKey("error", error));
        /*
        if (error.code == 400) {
          this.setState(byPropKey("error", error.message));
        } else {
          this.setState(byPropKey("error", error));
        }*/
      });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
      attempted
    } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      username === "";

    return (
      <div className="page signup">
        <section class="container">
          <form onSubmit={this.onSubmit}>
            <InputField
              value={username}
              field="username"
              label="Name"
              type="text"
              placeholder="Full Name"
              setState={obj => this.setState(obj)}
            />
            <InputField
              value={email}
              field="email"
              label="Email"
              type="text"
              placeholder="Email Address"
              setState={obj => this.setState(obj)}
            />
            <InputField
              value={passwordOne}
              type="password"
              field="passwordOne"
              label="Password"
              placeholder="Password"
              setState={obj => this.setState(obj)}
            />
            <InputField
              value={passwordTwo}
              type="password"
              field="passwordTwo"
              label="Confirmation"
              placeholder="Confirm Password"
              setState={obj => this.setState(obj)}
            />
            <Button
              action={e => this.onSubmit(e)}
              label="Sign Up >>"
              disabled={isInvalid}
              attempt={e => {
                this.setState({ attempted: true });
                e.preventDefault();
              }}
            />

            {error && <p>{error.message}</p>}
            {isInvalid &&
              attempted && <p>Invalid input 😔 (do your passwords match?)</p>}
          </form>
        </section>
      </div>
    );
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account?
    <Link to={"/signup"}> Sign Up</Link>
  </p>
);

export default withRouter(SignUpPage);

export { SignUpForm, SignUpLink };