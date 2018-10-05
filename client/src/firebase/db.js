import { db } from "./firebase";
import { getId } from "./auth";

export const doCreateUser = (id, name, email) =>
  db.ref(`users/${id}`).set({
    name,
    email
  });

export const doUpdateUser = newData =>
  db.ref(`users/${getId()}`).update({ ...newData });

export const onceGetUsers = () => db.ref("users").once("value");

export const doUpdateUserField = (field, folder, value, id) =>
  db
    .ref(`users/${id}`)
    .child(folder)
    .update({
      [field]: value
    });

export const doUpdatePage = (field, data) =>
  db.ref("pages").update({
    [field]: data
  });

export const loadPageIfExists = (field, cb) =>
  db
    .ref("pages")
    .child(field)
    .once("value")
    .then(function(snapshot) {
      console.log(snapshot.val());
      if (snapshot.exists()) {
        return snapshot.val();
      }
    })
    .then(url => fetch(url, { mode: "cors" }))
    .then(res => {
      return res.json();
    })
    .catch(err => {
      return Promise.reject(err);
    });

export const loadAssetIfExists = (field, cb) =>
  db
    .ref(`users/${getId()}`)
    .child(field)
    .once("value", function(snapshot) {
      if (snapshot.exists()) {
        cb(snapshot.val());
      }
    });

export const loadFolderIfExists = field =>
  db
    .ref(`users/${getId()}`)
    .child(field)
    .once("value")
    .then(function(snapshot) {
      if (snapshot.exists()) {
        return snapshot.val();
      }
    });
