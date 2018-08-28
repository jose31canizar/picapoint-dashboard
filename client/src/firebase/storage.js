import { storage } from "./firebase";
import { doUpdateUserField } from "./db";

export const uploadFile = (name, file, metadata, id, field) =>
  storage
    .ref()
    .child(name)
    .put(file, metadata)
    .then(snapshot => snapshot.ref.getDownloadURL())
    .then(url => {
      doUpdateUserField(field, url, id).then(() => {
        console.log("saved image!");
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
