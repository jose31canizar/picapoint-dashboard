import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// import registerServiceWorker from "./registerServiceWorker";
import "./styl/globals.styl";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCrown,
  faImage,
  faBullhorn,
  faThLarge,
  faStickyNote,
  faPaperclip,
  faUsers,
  faCog,
  faCamera,
  faTh,
  faSpinner,
  faCheck,
  faTimes,
  faTrash
} from "@fortawesome/fontawesome-free-solid";
library.add(
  faCrown,
  faImage,
  faBullhorn,
  faThLarge,
  faStickyNote,
  faPaperclip,
  faUsers,
  faCog,
  faCamera,
  faTh,
  faSpinner,
  faCheck,
  faTimes,
  faTrash
);

ReactDOM.render(<App />, document.getElementById("root"));
// registerServiceWorker();
