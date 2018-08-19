import React, { Component } from "react";
import "./Menubar.styl";
import BoardData from "../data/boards.json";
import LinkBlock from "../components/LinkBlock/LinkBlock";

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
              ? "translate3d(0,0,0)"
              : "translate3d(-300px,0,0)"
        }}
      >
        <div class="block-links">
          <h3>MENU</h3>
          {BoardData.map((link, i) => (
            <LinkBlock name={link.title} to={link.path} />
          ))}
        </div>
      </div>
    );
  }
}
