import React from "react"
import { Switch, HashRouter as Router, Route } from "react-router-dom"
import LayoutApp from "../containers/Layouts/App"
import Home from "../containers/Home"
import Vault from "../containers/Vault"
import Details from "../containers/Details"
import Network from "../containers/Network"

const createHistory = require("history").createBrowserHistory
const history = createHistory()

const routes = {
  app: {
    routes: [
      { path: "/", component: Home, exact: true },
      { path: "/vault", component: Vault, exact: true },
      { path: "/details", component: Details, exact: true },
      { path: "/network", component: Network, exact: true },
    ],
  }
}

const RouterApp = () => {
  return (
    <Router history={history}>
      <LayoutApp>
      <Switch>
      <Route
          path="/"
          exact={true}
          component={Home}
        />
              {routes.app.routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  exact={route.exact}
                  component={route.component}
                />
              ))}
            </Switch>
      </LayoutApp>
    </Router>
  );
};

export default RouterApp;
