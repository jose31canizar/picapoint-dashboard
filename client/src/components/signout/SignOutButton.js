import React from "react";
import { withRouter } from "react-router-dom";
import { auth } from "../../firebase";
import Button from "../../items/button/Button";
import { LOG_IN } from "../../constants/routes";

const SignOutButton = ({ history }) => (
  <div onClick={() => auth.doSignOut().then(() => history.push(LOG_IN))}>
    <label>Sign Out</label>
  </div>
);

export default withRouter(SignOutButton);
