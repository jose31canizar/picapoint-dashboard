import React, { Component } from "react";
import history from "./history";
import { Router, Switch, Route } from "react-router-dom";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Layout from "./layout";
import Pages from "./pages/Pages";
import Page from "./pages/template/PageTemplate";

// import { fab } from "@fortawesome/free-brands-svg-icons";
import { TransitionGroup, CSSTransition } from "react-transition-group";

// library.add(fab, faCircle);
const timeout = 1000;

const findTransition = route => {
  switch (route) {
    case "/":
      return {
        classNames: findTransitionName(route),
        timeout: timeout
      };
    default:
      return {
        classNames: findTransitionName(route),
        timeout: timeout
      };
  }
};

const findTransitionName = route => {
  switch (route) {
    case "/":
      return "home";
    default:
      return "transition";
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      panelState: "closed",
      currentRoute: history.location.pathname
    };
    this.togglePanel = this.togglePanel.bind(this);
    this.authenticate = this.authenticate.bind(this);

    history.listen(location => {
      this.setState({ currentRoute: location.pathname });
    });
  }
  togglePanel() {
    this.setState((prevState, props) => ({
      panelState: prevState.panelState === "closed" ? "open" : "closed"
    }));
  }
  authenticate(username, password) {
    console.log("authenticating...");
    history.push("/");
  }
  render() {
    const classNames = findTransition(this.state.currentRoute);
    console.log(this.state.currentRoute);

    const { authenticate } = this;

    return (
      <Router history={history}>
        <Layout
          panelState={this.state.panelState}
          togglePanel={this.togglePanel}
        >
          <Route
            render={({ location }) => (
              <TransitionGroup
                childFactory={child =>
                  React.cloneElement(
                    child,
                    findTransition(this.state.currentRoute)
                  )
                }
              >
                <CSSTransition
                  timeout={timeout}
                  classNames={findTransition(this.state.currentRoute)}
                  key={location.pathname}
                >
                  <Switch location={location}>
                    {Pages.map((page, i) => (
                      <Route
                        key={i}
                        exact
                        path={`/${page.path}`}
                        panelState={this.state.panelState}
                        render={() => (
                          <Page data={page.data} className={page.path} />
                        )}
                      />
                    ))}
                    <Route
                      exact
                      path="/login"
                      panelState={this.state.panelState}
                      render={() => <Login authenticate={authenticate} />}
                    />
                    <Route
                      path="*"
                      panelState={this.state.panelState}
                      render={() => <Home />}
                    />
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
            )}
          />
        </Layout>
      </Router>
    );
  }
}

export default App;
