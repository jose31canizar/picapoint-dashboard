import React, { Component } from "react";
import "./Menubar.styl";
import Pages from "../pages/Pages";
import { Link } from "react-router-dom";
import SignOutButton from "../components/signout/SignOutButton";

export default class Menubar extends Component {
  render() {
    const { panelState, togglePanel } = this.props;
    return (
      <div
        class="menu-bar"
        style={{
          ...this.props.style,
          transform:
            panelState === "open"
              ? "translate3d(0,0,0)"
              : "translate3d(300px,0,0)"
        }}
      >
        <div class="block-links">
          <h3>MENU</h3>
          {Pages.map((link, i) => (
            <Link
              to={link.path}
              tabIndex="-1"
              key={"page-link" + i}
              onClick={togglePanel}
            >
              {link.title}
            </Link>
          ))}
          <SignOutButton />
        </div>
      </div>
    );
  }
}
