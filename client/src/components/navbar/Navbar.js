import React, { Component } from "react";
import "./Navbar.styl";
import InputField from "../../items/input-field/InputField";
import NavbarIcon from "./NavbarIcon";
import { NavLink, Link, withRouter } from "react-router-dom";
import Pages from "../../pages/Pages";
import SignOutButton from "../signout/SignOutButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthUserContext from "../AuthUserContext";
import * as routes from "../../constants/routes";

class Navbar extends Component {
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
  onEnter = e => {
    const { history } = this.props;
    const { query } = this.state;
    if (e.keyCode === 13) {
      history.push(query);
    }
  };
  componentDidMount() {
    this.handleResize();

    window.addEventListener("resize", this.handleResize);
    window.addEventListener("keypress", this.onEnter);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("keypress", this.onEnter);
  }
  render() {
    const { width } = this.state;
    const { authUser, history } = this.props;
    if (width > 800) {
      return (
        <AuthUserContext.Consumer>
          {authUser => (
            <div class="nav-bar">
              <Link to={routes.HOME} tabIndex="-1">
                <h2 class="nav-bar-title">Picapoint</h2>
              </Link>
              {authUser ? (
                <div class="navbar-logged-in-items">
                  <InputField
                    placeholder="search"
                    label="filter"
                    field="query"
                    text="search your dashboard..."
                    setState={obj => this.setState(obj)}
                    datalistName="sections"
                    datalist={
                      <datalist id="sections">
                        {Pages.map((page, i) => (
                          <option key={"option-" + i} value={page.path} />
                        ))}
                      </datalist>
                    }
                  />

                  <NavLink
                    to={routes.HOME}
                    tabIndex="-1"
                    class="navbar-logged-in-item"
                  >
                    <FontAwesomeIcon icon="th" color="black" />
                  </NavLink>
                  <SignOutButton className="navbar-logged-in-item" />
                  <NavLink
                    to="/account"
                    tabIndex="-1"
                    class="navbar-logged-in-item"
                  >
                    <label>Account</label>
                  </NavLink>
                </div>
              ) : null}
            </div>
          )}
        </AuthUserContext.Consumer>
      );
    } else {
      return (
        <div class="nav-bar-mobile">
          <Link to="/" tabIndex="-1">
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

export default withRouter(Navbar);
