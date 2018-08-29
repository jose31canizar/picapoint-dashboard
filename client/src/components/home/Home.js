import React, { Component } from "react";
import "./Home.styl";
import SVG from "../../items/svg";
import Pages from "../../pages/Pages";
import { Link } from "react-router-dom";
import Card from "../card/Card";
import PageTemplate from "../../pages/template/PageTemplate";
import Footer from "../../layout/Footer";
import withAuthorization from "../withAuthorization";
import { db } from "../../firebase";

class Home extends Component {
  constructor(props) {
    var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName("body")[0];
    const width = w.innerWidth || e.clientWidth || g.clientWidth;
    super(props);
    this.state = {
      width: width,
      name: null
    };
  }
  componentDidMount() {
    db.loadAssetIfExists("name", name => this.setState({ name }));
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
    const { name } = this.state;
    return (
      <div class="home">
        <div class="header">
          {name && <h2 class="home-header-title">Hei {name}</h2>}

          <p class="explanation">
            Her finner du guider og nedlastinger til å hjelpe deg i
            markedsføring og kommunikasjon for Nr1 Fitness.
          </p>
        </div>
        <div class="dashboard">
          {Pages.map(({ path, title, color, icon }, i) => (
            <Card
              path={path}
              title={title}
              color={color}
              icon={icon}
              key={"card-" + i}
            />
          ))}
        </div>
        <Footer />
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(Home);
