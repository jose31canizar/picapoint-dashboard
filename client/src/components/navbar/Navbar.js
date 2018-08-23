import React, { Component } from "react";
import "./Navbar.styl";
import InputField from "../../items/input-field/InputField";
import NavbarIcon from "./NavbarIcon";
import { NavLink, Link } from "react-router-dom";
import Pages from "../../pages/Pages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTh } from "@fortawesome/fontawesome-free-solid";

library.add(faTh);

export default class Navbar extends Component {
  constructor(props) {
    var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName("body")[0];
    const width = w.innerWidth || e.clientWidth || g.clientWidth;
    super(props);
    this.state = {
      width: width,
      panelState: this.props.panelState,
      query: ""
    };
    this.handleResize = this.handleResize.bind(this);
  }
  handleResize() {
    var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName("body")[0];
    const width = w.innerWidth || e.clientWidth || g.clientWidth;

    this.setState({ width });
  }
  componentDidMount() {
    this.handleResize();

    window.addEventListener("resize", this.handleResize);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
  render() {
    const { width } = this.state;
    if (width > 800) {
      return (
        <div class="nav-bar">
          <Link to="/">
            <h2 class="nav-bar-title">Picapoint</h2>
          </Link>
          <InputField
            placeholder="search"
            label="filter"
            field="query"
            text="search your dashboard..."
            setState={obj => this.setState(obj)}
          />
          <datalist id="sections">
            {Pages.map((page, i) => (
              <option key={"option-" + i} value={page.title} />
            ))}
          </datalist>
          <Link to="/">
            <FontAwesomeIcon icon={faTh} color="black" />
          </Link>
        </div>
      );
    } else {
      return (
        <div class="nav-bar-mobile">
          <Link to="/">
            <h2
              class={
                this.props.panelState === "closed" ? "" : "hide-nav-bar-title"
              }
            >
              Picapoint
            </h2>
          </Link>
          <NavbarIcon
            togglePanel={this.props.togglePanel}
            panelState={this.props.panelState}
          />
        </div>
      );
    }
  }
}
