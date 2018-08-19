import React, { Component } from "react";
import Navbar from "../navbar/Navbar";
import Menubar from "./Menubar";
import "./Layout.styl";

export default class Layout extends Component {
  render() {
    return (
      <div class="layout">
        <img src={require("../img/color-burst.jpg")} />
        <Navbar
          togglePanel={this.props.togglePanel}
          panelState={this.props.panelState}
        />
        <Menubar panelState={this.props.panelState} />
        {this.props.children}
      </div>
    );
  }
}
