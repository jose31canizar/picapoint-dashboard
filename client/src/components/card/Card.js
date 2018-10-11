import React from "react";
import { Link } from "react-router-dom";
import "./Card.styl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Card = props => (
  <span class="card">
    <Link to={props.path} class="card-link" tabIndex="-1">
      <div class="card-content" style={{ backgroundColor: props.color }}>
        <FontAwesomeIcon icon={props.icon} color="#ffffff75" />
      </div>
      <div class="card-label">
        <label>{props.title}</label>
      </div>
    </Link>
  </span>
);
export default Card;
