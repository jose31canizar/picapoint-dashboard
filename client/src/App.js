import React, { Component } from "react";
import history from "./history";
import { Router, Switch, Route } from "react-router-dom";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import Layout from "./layout/Layout";
import Pages from "./pages/Pages";
import Page from "./pages/template/PageTemplate";
import * as routes from "./constants/routes";
import { TransitionGroup, CSSTransition } from "react-transition-group";
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
    case routes.HOME:
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
    history.push(routes.HOME);
  }
  render() {
    const classNames = findTransition(this.state.currentRoute);
    console.log(this.state.currentRoute);

    const { authenticate, togglePanel } = this;
    const { panelState, currentRoute } = this.state;

    return (
      <Router history={history}>
        <Layout panelState={panelState} togglePanel={togglePanel}>
          <Route
            render={({ location }) => (
              <TransitionGroup
                childFactory={child =>
                  React.cloneElement(child, findTransition(currentRoute))
                }
              >
                <CSSTransition
                  timeout={timeout}
                  classNames={findTransition(currentRoute)}
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
                          <Page path={page.path} className={page.path} />
                        )}
                      />
                    ))}
                    <Route
                      exact
                      path={routes.LOG_IN}
                      panelState={panelState}
                      render={() => <Login authenticate={authenticate} />}
                    />
                    <Route
                      exact
                      path={routes.LOG_IN}
                      panelState={panelState}
                      render={() => <Login authenticate={authenticate} />}
                    />
                    <Route
                      exact
                      path={routes.SIGN_UP}
                      panelState={panelState}
                      render={() => <Signup />}
                    />
                    <Route
                      path="*"
                      panelState={panelState}
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
