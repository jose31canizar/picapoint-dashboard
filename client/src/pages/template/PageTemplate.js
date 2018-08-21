import React from "react";
import "./Template.styl";

const PageTemplate = props => {
  const { data, style, className } = props;
  return (
    <div class={`page ${className}`} style={style && style}>
      <h1>Page</h1>
      <h1>{data}</h1>
    </div>
  );
};

export default PageTemplate;
