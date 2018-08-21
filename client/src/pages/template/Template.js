import React from "react";
import "./Template.styl";

const Template = props => {
  const { style, className } = props;
  return (
    <div class={`page ${className && className}`} style={style && style}>
      {props.children}
    </div>
  );
};

export default Template;
