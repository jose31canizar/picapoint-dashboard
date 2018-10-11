import React from "react";
import "./Suggestions.styl";

const HASHTAGS = ["one", "two", "three", "four", "five", "six", "seven"];

export default class Suggestions extends React.Component {
  render() {
    const { autocompleteState, renderSuggestion } = this.props;
    if (!autocompleteState) return null;
    const { searchText, cursor } = autocompleteState;
    const { x, y } = cursor;
    return (
      <div
        class="suggestions-dropdown"
        style={{ transform: `translate3d(${x}px,${y + 20}px,0)` }}
      >
        <ul>
          {HASHTAGS.filter(
            item => item.substring(0, searchText.length) === searchText
          ).map(result => (
            <li onMouseDown={() => renderSuggestion(result)}>{result}</li>
          ))}
        </ul>
      </div>
    );
  }
}
