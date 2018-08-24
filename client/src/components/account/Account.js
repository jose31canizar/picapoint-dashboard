import React from "react";
import AuthUserContext from "../AuthUserContext";
import { PasswordForgetForm } from "../password-forget/PasswordForget";
import PasswordChangeForm from "../password-change/PasswordChange";
import withAuthorization from "../withAuthorization";
import "./Account.styl";

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div class="account">
        <h1>Account: {authUser.email}</h1>
        <PasswordForgetForm />
        <PasswordChangeForm />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(AccountPage);
