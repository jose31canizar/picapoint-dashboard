const express = require("express");
const app = express();
const path = require("path");

const port = 9001;

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(port, err => {
  if (err) {
    return console.log("something bad happened");
  }
  console.log(`listening on port ${port}`);
});
