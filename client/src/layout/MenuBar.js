import React, { Component } from "react";
import "./Menubar.styl";
import Pages from "../pages/Pages";
import { Link } from "react-router-dom";

export default class Menubar extends Component {
  render() {
    const { panelState } = this.props;
    return (
      <div
        class="menu-bar"
        style={{
          ...this.props.style,
          transform:
            panelState === "open"
              ? "translate3d(-300px,0,0)"
              : "translate3d(0,0,0)"
        }}
      >
        <div class="block-links">
          <h3>MENU</h3>
          {Pages.map((link, i) => (
            <Link to={link.path} key={"page-link" + i}>
              {link.title}
            </Link>
          ))}
        </div>
      </div>
    );
  }
}
