import React, { Component } from "react";
import "./Home.styl";
import SVG from "../assets/svg";
import Boards from "../data/boards.json";
import { Link } from "react-router-dom";

export default class Home extends Component {
  constructor(props) {
    var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName("body")[0];
    const width = w.innerWidth || e.clientWidth || g.clientWidth;
    super(props);
    this.state = {
      width: width
    };
  }
  componentDidMount() {
    window.addEventListener("resize", () => {
      var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName("body")[0];
      const width = w.innerWidth || e.clientWidth || g.clientWidth;
      this.setState({ width: w });
    });
  }
  render() {
    return (
      <div class="home" style={this.props.style}>
        <img class="logo" src={require(`../img/logo-red.png`)} alt="Bound" />
        {Boards.map((screen, i) => (
          <span class="section-entrance" key={i}>
            <Link to={screen.path} class="board-link">
              <label>{screen.title}</label>
              <label>{screen.title}</label>
            </Link>
          </span>
        ))}
      </div>
    );
  }
}
