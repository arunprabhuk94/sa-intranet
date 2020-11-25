import React, { useEffect, useCallback } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";

import Home from "./components/site/Home";
import Dashboard from "./components/dashboard/Dashboard";
import { setUserAction } from "./store/actions/authActions";
import { apiRequest } from "./utils/requests";

function App(props) {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const autoLogin = useCallback(async () => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    const unprotectedRoutes = ["/login", "/", "/signup"];
    const isUnprotectedRoute = unprotectedRoutes.includes(
      props.location.pathname
    );
    try {
      if (!auth.isLoggedIn) {
        if (token) {
          const response = await apiRequest("get", `/users/autologin`, {
            token,
          });
          if (response.data.users && response.data.user.company)
            response.data.user.company.users = response.data.users;
          dispatch(
            setUserAction({ ...response.data, token }, props.history, {
              isAutoLogin: true,
            })
          );
        } else if (!isUnprotectedRoute) props.history.replace("/login");
      }
    } catch (err) {
      if (!isUnprotectedRoute) props.history.replace("/login");
    }
  }, [dispatch, props.history, props.location.pathname, auth]);

  useEffect(() => {
    autoLogin();
  }, [autoLogin]);

  return (
    <div className="App container-fluid d-flex align-items-stretch">
      <Switch>
        <Route
          path="/app"
          render={(routeParams) => <Dashboard {...routeParams} />}
        />
        <Route path="/" render={(routeParams) => <Home {...routeParams} />} />
      </Switch>
    </div>
  );
}

export default withRouter(App);
