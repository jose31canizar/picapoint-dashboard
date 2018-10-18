import React, { Component } from "react";
import "./Navbar.styl";
import InputField from "../../items/input-field/InputField";
import UserPages from "../../pages/UserPages.json";
import NavbarIcon from "./NavbarIcon";
import { NavLink, Link, withRouter } from "react-router-dom";
import SignOutButton from "../signout/SignOutButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthUserContext from "../AuthUserContext";
import * as routes from "../../constants/routes";
import SearchBar from "../../components/search-bar/SearchBar";

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
      dropdown: true
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
    if (e.keyCode === 13) {
      // history.push(query);
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
    const { width, dropdown } = this.state;
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
                  <SearchBar
                    placeholder="search"
                    label="filter"
                    text="search your dashboard..."
                  />

                  <NavLink
                    to={routes.HOME}
                    tabIndex="-1"
                    className="navbar-logged-in-item"
                  >
                    <FontAwesomeIcon icon="th" color="black" />
                  </NavLink>
                  <SignOutButton className="navbar-logged-in-item" />

                  <div
                    class="dropdown-trigger"
                    onMouseOver={() => this.setState({ dropdown: true })}
                    onMouseLeave={() => this.setState({ dropdown: false })}
                  >
                    <NavLink
                      to="/account"
                      tabIndex="-1"
                      className="navbar-logged-in-item dropdown-trigger-label"
                    >
                      <label>Account</label>
                    </NavLink>
                    {dropdown && (
                      <div class="dropdown-items">
                        {UserPages.map(({ path, title }, i) => (
                          <NavLink to={path} tabIndex="-1" class="navbar-item">
                            <label>{title}</label>
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
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
