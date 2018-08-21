import React, { Component } from "react";
import "./NavbarIcon.styl";

export default class NavbarIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      MenuBarIconStyle: "menu-bar-icon unclicked"
    };
    this.toggleIcon = this.toggleIcon.bind(this);
  }
  toggleIcon() {
    this.setState((prevState, props) => {
      var newProp;
      if (prevState.MenuBarIconStyle === "menu-bar-icon unclicked") {
        newProp = "menu-bar-icon clicked";
      } else {
        newProp = "menu-bar-icon unclicked";
      }
      return {
        MenuBarIconStyle: newProp
      };
    });
  }
  componentWillReceiveProps(props) {
    console.log("updated");
    if (props.panelState === "open") {
      this.setState({ MenuBarIconStyle: "menu-bar-icon clicked" });
    } else {
      this.setState({ MenuBarIconStyle: "menu-bar-icon unclicked" });
    }
  }
  render() {
    return (
      <button
        class={this.state.MenuBarIconStyle}
        onMouseDown={this.props.togglePanel}
      >
        <div id="top-bar" />
        <div id="middle-bar" />
        <div id="bottom-bar" />
      </button>
    );
  }
}
