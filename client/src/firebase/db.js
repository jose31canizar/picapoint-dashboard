import { db } from "./firebase";

export const doCreateUser = (id, username, email) =>
  db.ref(`users/${id}`).set({
    username,
    email
  });

export const onceGetUsers = () => db.ref("users").once("value");

export const updateUserField = (field, value, id) =>
  db.ref(`users/${id}`).update({
    [field]: value
  });

export const loadAssetIfExists = (id, field, cb) =>
  db
    .ref(`users/${id}`)
    .child(field)
    .once("value", function(snapshot) {
      if (snapshot.exists()) {
        cb(snapshot.val());
      }
    });
