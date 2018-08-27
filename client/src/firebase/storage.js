import { storage } from "./firebase";
import { updateUserField } from "./db";

export const uploadFile = (name, file, metadata, id) =>
  storage
    .ref()
    .child(name)
    .put(file, metadata)
    .then(snapshot => snapshot.ref.getDownloadURL())
    .then(url => {
      console.log(url);
      updateUserField("profile_picture", url, id).then(img => {
        console.log("saved profile picture!");
        console.log(img);
      });
    })
    .catch(error => {
      switch (error.code) {
        case "storage/unauthorized":
          console.log("user does not have permission to access the object");
          break;
        case "storage/canceled":
          console.log("user canceled the upload");
          break;
        case "storage/unknown":
          console.log("unknown user occurred, inspect error.serverResponse");
          break;
      }
    });
