import React, { Component } from "react";
import AuthUserContext from "../AuthUserContext";
import { PasswordForgetForm } from "../password-forget/PasswordForget";
import PasswordChangeForm from "../password-change/PasswordChange";
import withAuthorization from "../withAuthorization";
import { storage, db } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Account.styl";

class AccountProfile extends Component {
  state = {
    imageData: null,
    imageExists: false
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
    const { uid } = this.props.authUser;
    db.loadAssetIfExists(uid, "profile_picture", imageData =>
      this.setState({ imageData, imageExists: true })
    );
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
    const { imageData, imageExists } = this.state;
    const { authUser } = this.props;
    return (
      <div class="account-profile">
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
          <h3>Here's your account {authUser.username}</h3>
          <h3>{authUser.email}</h3>
        </div>
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
