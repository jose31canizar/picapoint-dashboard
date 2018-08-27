import React, { Component } from "react";
import AuthUserContext from "../AuthUserContext";
import { PasswordForgetForm } from "../password-forget/PasswordForget";
import PasswordChangeForm from "../password-change/PasswordChange";
import UpdateAccount from "../update-account/UpdateAccount";
import withAuthorization from "../withAuthorization";
import { storage, db } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Account.styl";

class AccountProfile extends Component {
  state = {
    imageData: null,
    imageExists: false,
    name: null
  };
  uploadFile = (e, id) => {
    const file = this.fileUploader.files[0];
    const type = file.type;
    const name = +new Date() + "-" + file.name;
    const metadata = {
      contentType: type
    };
    this.previewImage(file, type);
    storage.uploadFile(name, file, metadata, id);
  };
  componentDidMount() {
    db.loadAssetIfExists("profile_picture", imageData =>
      this.setState({ imageData, imageExists: true })
    );
    db.loadAssetIfExists("name", name => this.setState({ name }));
  }
  previewImage = (file, type) => {
    let reader = new FileReader();
    reader.onload = e => {
      console.log("loaded preview");
      console.log(e);
      console.log(e.target.result);
      console.log(typeof e.target.result);
      this.setState({
        imageData: e.target.result,
        imageExists: true
      });
    };

    reader.readAsDataURL(file);
  };
  render() {
    const { name, imageData, imageExists } = this.state;
    const { authUser } = this.props;

    return (
      <div class="account-profile">
        {name ? (
          <div style={{ display: "flex" }}>
            <div class="profile-picture-container">
              <input
                type="file"
                name="file"
                id="file"
                accept=".jpg, .jpeg, .png"
                ref={ref => (this.fileUploader = ref)}
                onChange={e => this.uploadFile(e, authUser.uid)}
              />
              <label for="file" class="file-upload-button" />
              {imageExists ? (
                <img src={imageData} alt="could not load profile image" />
              ) : (
                <FontAwesomeIcon icon="camera" />
              )}
            </div>
            <div class="profile-info">
              <h3>Here's your account,</h3>
              <h3>{name}</h3>
              <h5>{authUser.email}</h5>
            </div>
          </div>
        ) : (
          <FontAwesomeIcon icon="spinner" spin />
        )}
      </div>
    );
  }
}

class AccountPage extends Component {
  render() {
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div class="account">
            <AccountProfile authUser={authUser} />
            <UpdateAccount />
            <PasswordForgetForm />
            <PasswordChangeForm />
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}
const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(AccountPage);
