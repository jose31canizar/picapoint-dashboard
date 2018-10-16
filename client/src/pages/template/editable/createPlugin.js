import React from "react";
import history from "../../../history";

export default function createPlugin(type, className, REGEX) {
  function strategy(contentBlock, callback, contentState) {
    // findWithRegex(REGEX, contentBlock, callback);
    findLinkEntities(contentBlock, callback, contentState);
  }

  function findWithRegex(regex, contentBlock, callback) {
    const text = contentBlock.getText();
    let matchArr, start;
    while ((matchArr = regex.exec(text)) !== null) {
      start = matchArr.index;
      callback(start, start + matchArr[0].length);
    }
  }

  function findLinkEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(character => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === type
      );
    }, callback);
  }
  const component = props => {
    // console.log(props);

    if (!props.entityKey) {
      console.log(props);
      return <span class={className}>{props.children}</span>;
    }

    const { url } = props.contentState.getEntity(props.entityKey).getData();

    return (
      <span class={className} onClick={() => console.log(url)}>
        {props.children}
      </span>
    );
  };
  return {
    strategy,
    component
  };
}
