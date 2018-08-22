import React, { Component } from "react";
import Navbar from "../components/navbar/Navbar";
import Menubar from "./Menubar";
import "./Layout.styl";

export default class Layout extends Component {
  render() {
    return (
      <div class="layout">
        <Navbar
          togglePanel={this.props.togglePanel}
          panelState={this.props.panelState}
        />
        <div class="content">{this.props.children}</div>
        <div class="background-layer" />
        <Menubar panelState={this.props.panelState} />
      </div>
    );
  }
}
