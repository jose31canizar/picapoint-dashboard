import React, { Component } from "react";
import AuthUserContext from "../AuthUserContext";
import { PasswordForgetForm } from "../password-forget/PasswordForget";
import PasswordChangeForm from "../password-change/PasswordChange";
import UpdateAccount from "../update-account/UpdateAccount";
import withAuthorization from "../withAuthorization";
import { storage, db } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputField from "../../items/input-field/InputField";
import Button from "../../items/button/Button";
import Notification from "../../items/notification/Notification";
import "./Account.styl";
import obj2fd from "obj2fd";

const MediaUploader = ({
  uploadFile,
  authUser,
  mediaUploader,
  mediaItemName
}) => (
  <div class="media-uploader-container">
    <input
      type="file"
      name="media-file"
      id="media-file"
      ref={ref => (mediaUploader = ref)}
      onChange={e =>
        uploadFile(
          e,
          mediaUploader,
          authUser.uid,
          mediaItemName,
          false,
          "media"
        )
      }
    />

    <Button
      disabled={!mediaItemName}
      htmlFor="media-file"
      label="Upload Media"
    />
  </div>
);

class AccountProfile extends Component {
  state = {
    imageData: null,
    imageExists: false,
    name: null,
    mediaItemName: null,
    uploadMessage: null
  };
  uploadFile = (e, uploader, id, field, preview, folder) => {
    const file = uploader.files[0];
    if (!file) {
      return;
    }
    const type = file.type;
    // const name = +new Date() + "-" + file.name;
    const name = file.name;
    const metadata = {
      contentType: type
    };
    if (preview) {
      this.previewImage(file, type);
    }

    const body = {
      name,
      file,
      metadata,
      id,
      field,
      folder
    };

    const data = obj2fd(body);

    console.log(data);

    fetch("http://localhost:9001/storage-upload", {
      method: "post",
      body: data
    }).then(() =>
      this.setState(
        {
          uploadMessage: `uploaded ${name} to storage database.`
        },
        () =>
          setTimeout(() => {
            this.setState({ uploadMessage: null });
          }, 3000)
      )
    );
  };
  componentDidMount() {
    db.loadAssetIfExists("profile/profile_picture", imageData =>
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
    const {
      name,
      imageData,
      imageExists,
      mediaItemName,
      uploadMessage
    } = this.state;
    const { authUser } = this.props;

    return (
      <div class="account-profile">
        {uploadMessage && <Notification text={uploadMessage} />}
        {name ? (
          <div class="profile-info">
            <div class="profile-picture-container">
              <input
                type="file"
                name="file"
                id="file"
                accept=".jpg, .jpeg, .png"
                ref={ref => (this.fileUploader = ref)}
                onChange={e =>
                  this.uploadFile(
                    e,
                    this.fileUploader,
                    authUser.uid,
                    "profile_picture",
                    true,
                    "profile"
                  )
                }
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
        <InputField
          value={mediaItemName}
          field="mediaItemName"
          label="Media Item"
          type="text"
          placeholder="Name of media item"
          setState={obj => this.setState(obj)}
        />
        <MediaUploader
          uploadFile={this.uploadFile}
          authUser={authUser}
          mediaUploader={this.mediaUploader}
          mediaItemName={mediaItemName}
        />
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
