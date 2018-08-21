import React, { Component } from "react";
import Navbar from "../components/navbar/Navbar";
import Menubar from "./Menubar";
import "./index.styl";

export default class Layout extends Component {
  render() {
    return (
      <div class="layout">
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
