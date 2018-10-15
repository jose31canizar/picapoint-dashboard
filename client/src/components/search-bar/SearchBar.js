import React, { Component } from "react";
import { Link } from "react-router-dom";
import InputField from "../../items/input-field/InputField";
import Pages from "../../pages/Pages";
import { queryPage } from "../../elasticsearch";
import "./SearchBar.styl";

export default class SearchBar extends Component {
  state = {
    results: [],
    query: ""
  };
  search = obj => {
    this.setState(obj());
    queryPage(obj().query).then(results => this.setState({ results }));
  };
  render() {
    const {
      placeholder,
      label,
      field,
      text,
      setState,
      datalistName,
      datalist
    } = this.props;
    const { search } = this;
    const { query, results } = this.state;
    return (
      <div class="search-bar">
        <InputField
          placeholder={placeholder}
          label={label}
          text={text}
          datalistName={datalistName}
          datalist={datalist}
          field="query"
          type="text"
          value={query}
          datalistName="sections"
          autocomplete={false}
          setState={obj => search(obj)}
          datalist={
            <datalist id="sections">
              {Pages.map((page, i) => (
                <option key={"option-" + i} value={page.path} />
              ))}
              <option value="Title">Subtitle</option>
            </datalist>
          }
        />
        {results.length ? (
          <div class="results-list">
            {results.map((result, i) => (
              <Link
                to={result._source.page}
                onClick={() => this.setState({ results: [] })}
              >
                <p>{result._source.page}</p>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}
