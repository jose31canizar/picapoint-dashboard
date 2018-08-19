import React, { Component } from "react";
import history from "./history";
import { Router, Switch, Route } from "react-router-dom";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Layout from "./layout";

import { TransitionGroup, CSSTransition } from "react-transition-group";

const findTransition = route => {
  switch (route) {
    case "/":
      return {
        classNames: findTransitionName(route),
        timeout: 1000
      };
    default:
      return {
        classNames: findTransitionName(route),
        timeout: 1000
      };
  }
};

const findTransitionName = route => {
  switch (route) {
    case "/":
      return "home";
    case "/music":
      return "transition";
    case "/merch":
      return "transition";
    case "/podcasts":
      return "transition";
    case "/videos":
      return "transition";
    case "/login":
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

    history.listen(location => {
      this.setState({ currentRoute: location.pathname });
    });
  }
  togglePanel() {
    this.setState((prevState, props) => ({
      panelState: prevState.panelState === "closed" ? "open" : "closed"
    }));
  }
  render() {
    const classNames = "transition";
    console.log(this.state.currentRoute);
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
                  timeout={2000}
                  classNames={classNames}
                  key={location.key}
                >
                  <Switch location={location}>
                    {Boards.map((board, i) => (
                      <Route
                        key={i}
                        exact
                        path={`/${board.path}`}
                        panelState={this.state.panelState}
                        render={() => <Board data={board.data} />}
                      />
                    ))}
                    <Route
                      exact
                      path="/login"
                      panelState={this.state.panelState}
                      render={() => <Login />}
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
