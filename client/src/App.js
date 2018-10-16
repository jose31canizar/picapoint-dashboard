import React, { Component } from "react";
import history from "./history";
import { Router, Switch, Route } from "react-router-dom";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import PasswordForget from "./components/password-forget/PasswordForget";
import Account from "./components/account/Account";
import Layout from "./layout/Layout";
import Pages from "./pages/Pages";
import Article from "./pages/template/article/ArticleTemplate";
import CustomPage from "./pages/template/custom/CustomTemplate";
import EditablePage from "./pages/template/editable/EditableTemplate";
import * as routes from "./constants/routes";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import withAuthentication from "./components/withAuthentication";

const timeout = 1000;

const findTransition = route => {
  switch (route) {
    case "/home":
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
  state = {
    panelState: "closed",
    currentRoute: history.location.pathname,
    currentTransitionType: findTransition("/home")
  };
  componentDidMount() {
    history.listen(location => {
      console.log(location);
      this.setState({
        currentRoute: location.pathname,
        currentTransitionType: findTransition(location.pathname)
      });
    });
  }
  togglePanel = () => {
    this.setState((prevState, props) => ({
      panelState: prevState.panelState === "closed" ? "open" : "closed"
    }));
  };

  render() {
    const { authenticate, togglePanel } = this;
    const { panelState, currentRoute, currentTransitionType } = this.state;
    console.log(currentRoute);

    return (
      <Router history={history}>
        <Layout panelState={panelState} togglePanel={togglePanel}>
          <Route
            render={({ location }) => (
              <TransitionGroup
                childFactory={child =>
                  React.cloneElement(child, currentTransitionType)
                }
              >
                <CSSTransition
                  timeout={timeout}
                  classNames={currentTransitionType}
                  key={location.pathname}
                >
                  <Switch location={location}>
                    {Pages.map((page, i) => (
                      <Route
                        key={i}
                        exact
                        path={`/${page.path}`}
                        panelState={this.state.panelState}
                        render={() =>
                          page.type === "markdown" ? (
                            <Article path={page.path} className={page.path} />
                          ) : page.type === "editable" ? (
                            <EditablePage
                              path={page.path}
                              className={page.path}
                              editing={page.editing}
                            />
                          ) : (
                            <CustomPage
                              path={page.path}
                              className={page.path}
                            />
                          )
                        }
                      />
                    ))}
                    <Route
                      exact
                      path={routes.HOME}
                      panelState={panelState}
                      render={() => <Home />}
                    />
                    <Route
                      exact
                      path={routes.LOG_IN}
                      panelState={panelState}
                      render={() => <Login />}
                    />
                    <Route
                      exact
                      path={routes.SIGN_UP}
                      panelState={panelState}
                      render={() => <Signup />}
                    />
                    <Route
                      exact
                      path={routes.PASSWORD_FORGET}
                      panelState={panelState}
                      render={() => <PasswordForget />}
                    />
                    <Route
                      exact
                      path={routes.ACCOUNT}
                      panelState={panelState}
                      render={() => <Account />}
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

export default withAuthentication(App);
