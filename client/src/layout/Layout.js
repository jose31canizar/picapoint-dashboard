import React, { Component } from "react";
import Navbar from "../components/navbar/Navbar";
import Menubar from "./Menubar";
import "./Layout.styl";

export default class Layout extends Component {
  render() {
    const { panelState, togglePanel } = this.props;
    return (
      <div class="layout">
        <Navbar
          togglePanel={this.props.togglePanel}
          panelState={this.props.panelState}
        />
        <div
          class="content"
          style={{ marginLeft: panelState === "open" ? -300 : 0 }}
        >
          {this.props.children}
        </div>
        <div class="background-layer" />
        <Menubar panelState={this.props.panelState} togglePanel={togglePanel} />
      </div>
    );
  }
}
