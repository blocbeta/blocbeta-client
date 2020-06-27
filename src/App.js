import React, { createContext, Fragment, useMemo, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Header from "./components/Navigation/Header";
import { Content } from "./components/Content/Content";
import { router } from "./router";
import { ToastContainer } from "react-toastify";
import { Footer } from "./components/Footer/Footer";
import { ReactQueryDevtools } from "react-query-devtools";
import usePersistentState from "./hooks/usePersistentState";
import jwt_decode from "jwt-decode";
import { Helmet } from "react-helmet";

export const Meta = ({ title }) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>Blocbeta - {title}</title>
    </Helmet>
  );
};

export const AppContext = createContext();

export const getLocationSlug = () => {
  return window.location.pathname.split("/")[1];
};

const App = () => {
  const [user, setUser] = usePersistentState("user", null);
  const [token, setToken] = usePersistentState("token", null);
  const [currentLocation, setCurrentLocation] = usePersistentState(
    "location",
    null
  );
  const [expiration, setExpiration] = usePersistentState("expiration", null);
  const [contentDisabled, disableContent] = useState(false);

  const reset = () => {
    setUser(null);
    setToken(null);
    setCurrentLocation(null);
    setExpiration(null);

    localStorage.clear();
  };

  const locationPath = (path) => {
    return `/${getLocationSlug()}${path}`;
  };

  const authenticated = () => {
    if (token === null) {
      return false;
    }

    return new Date().getTime() / 1000 <= expiration;
  };

  const isAdmin = useMemo(() => {
    if (!token) {
      return false;
    }

    const payload = jwt_decode(token);

    return Object.values(payload.roles).includes(
      `ROLE_ADMIN@${currentLocation.id}`
    );
  }, [token]);

  const appContextValues = {
    token,
    setToken,
    user,
    setUser,
    currentLocation,
    setCurrentLocation,
    expiration,
    setExpiration,
    contentDisabled,

    disableContent,
    isAdmin,
    authenticated,
    reset,
    locationPath,
  };

  const PrivateRoute = ({ children, ...rest }) => {
    if (authenticated()) {
      return <Route {...rest} />;
    }

    return (
      <Route
        {...rest}
        render={() => (authenticated() ? children : <LoginRedirect />)}
      />
    );
  };

  const DashboardRedirect = () =>{
    return (
        <Redirect
            to={{
              pathname: locationPath('/dashboard'),
            }}
        />
    );
  };

  const LoginRedirect = () => {
    reset();

    return (
      <Redirect
        to={{
          pathname: "/login",
        }}
      />
    );
  };

  return (
    <Fragment>
      <Router>
        <AppContext.Provider value={appContextValues}>
          <Header />

          <Content disabled={contentDisabled}>
            <Switch>
              {router.filter(route => {
                  if (route.admin === true && !isAdmin) {
                      return false
                  }

                  if (route.visibleOnly === true && user && !user.visible) {
                      return false
                  }

                  return true
              }).map((route, i) => {

                if (!route.public) {
                  return <PrivateRoute key={i} {...route} />;
                }

                return <Route key={i} {...route} />;
              })}

              <Route render={() => <LoginRedirect />} />
            </Switch>
          </Content>
        </AppContext.Provider>
      </Router>

      <ToastContainer />
      <Footer />

      <ReactQueryDevtools initialIsOpen={process.env.REACT_APP_ENV === "dev"} />
    </Fragment>
  );
};

export default App;
