const express = require("express");
const app = express();
const path = require("path");
// import { storage, auth } from "./firebase";
var bodyParser = require("body-parser");
// import multer from "multer";
const multer = require("multer");
global.XMLHttpRequest = require("xhr2");
if (process.env.NODE_ENV === "development") {
  const cors = require("cors");
  app.use(cors());
}
let upload = multer();

const port = 9001;

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "static_build")));

// app.post("/login", function({ body: { email, password } }, res) {
//   auth
//     .doSignInWithEmailAndPassword(email, password)
//     .then(() => res.send("success"));
// });

// app.post("/storage-upload", upload.single("file"), (req, res) => {
//   console.log(`uploading ${req.body.name} to database...`);
//   const { name, metadata, id, field, folder } = req.body;

//   auth
//     .doSignInWithEmailAndPassword("jose@picapoint.no", "123456")
//     .then(() =>
//       storage.uploadFile(name, req.file.buffer, metadata, id, field, folder)
//     )
//     .then(() => {
//       console.log("uploaded.");
//       res.send("uploaded");
//     });
// });

// app.get("*.js", function(req, res, next) {
//   req.url = req.url + ".gz";
//   res.set("Content-Encoding", "gzip");
//   res.set("Content-Type", "text/javascript");
//   next();
// });
// app.get("*.css", function(req, res, next) {
//   req.url = req.url + ".gz";
//   res.set("Content-Encoding", "gzip");
//   res.set("Content-Type", "text/css");
//   next();
// });

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "static_build", "index.html"));
});

app.listen(port, err => {
  if (err) {
    return console.log("something bad happened");
  }
  console.log(`listening on port ${port}`);
});
