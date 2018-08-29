import React from "react";
import { Link } from "react-router-dom";
import "./Footer.styl";
import * as routes from "../constants/routes";
const Footer = props => (
  <footer class="footer">
    <Link to={routes.LOG_IN} tabIndex="-1">
      Logg ut
    </Link>
    <p>Merkevareportalen er en tjeneste levert av</p>
  </footer>
);

export default Footer;
