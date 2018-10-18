import { storage } from "./firebase";
import { doUpdateUserField, doUpdatePage } from "./db";

export const uploadFile = (name, file, metadata, id, field, folder) =>
  storage
    .ref()
    .child(`media/${name}`)
    .put(file, metadata)
    .then(snapshot => snapshot.ref.getDownloadURL())
    .then(url => doUpdateUserField(field, folder, url, id))
    .catch(error => {
      console.log(error.toString());
      console.log(error.code);

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

export const savePage = (name, data) =>
  storage
    .ref()
    .child(`pages/${name}`)
    .putString(data)
    .then(snapshot => snapshot.ref.getDownloadURL())
    .then(url => doUpdatePage(name, url))
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
