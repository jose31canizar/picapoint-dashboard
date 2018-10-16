import React, { Component } from "react";
import "./PageTemplate.styl";
export default class PageTemplate extends Component {
  render() {
    const { style, className } = this.props;
    return (
      <div class={`page`} style={style && style}>
        {this.props.children}
      </div>
    );
  }
}
