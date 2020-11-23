import React from "react";
import { Route, Switch, withRouter, useRouteMatch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import signupPageImage from "../../assets/images/company-people.svg";
import setupPageImage from "../../assets/images/single-user.svg";

import Signup from "./setup/Signup";
import Login from "./setup/Login";
import Logout from "../dashboard/Logout";
import Header from "./Header";
import "./Home.css";
import EmailVerification from "./setup/EmailVerification";
import CompanyDetails from "./setup/CompanyDetails";
import PasswordCreation from "./setup/PasswordCreation";

const homePagePaths = ["/signup", "/", ""];

const Home = ({ location }) => {
  const dispatch = useDispatch();
  const { path } = useRouteMatch();
  const auth = useSelector((state) => state.auth);

  return (
    <div className="home-page-container">
      <Header />
      <div className="page-contents mt-3">
        <div className="row" style={{ width: "calc(100% + 30px)" }}>
          <div className="col-md-6 d-none d-md-flex align-items-center">
            <img
              className="img-fluid"
              src={
                homePagePaths.includes(location.pathname)
                  ? signupPageImage
                  : setupPageImage
              }
              alt="Chania"
            />
          </div>
          <div className="col-md-6 d-flex align-items-center">
            <Switch>
              <Route
                path={`${path}login`}
                render={(routeParams) => (
                  <Login dispatch={dispatch} auth={auth} {...routeParams} />
                )}
              />
              <Route
                path={`${path}logout`}
                render={(routeParams) => (
                  <Logout dispatch={dispatch} auth={auth} {...routeParams} />
                )}
              />
              <Route
                path={`${path}verifyemail`}
                render={(routeParams) => (
                  <EmailVerification
                    dispatch={dispatch}
                    auth={auth}
                    {...routeParams}
                  />
                )}
              />
              <Route
                path={`${path}setcompanydetails`}
                render={(routeParams) => (
                  <CompanyDetails
                    dispatch={dispatch}
                    auth={auth}
                    {...routeParams}
                  />
                )}
              />
              <Route
                path={`${path}setpassword`}
                render={(routeParams) => (
                  <PasswordCreation
                    dispatch={dispatch}
                    auth={auth}
                    {...routeParams}
                  />
                )}
              />
              <Route
                path={path}
                render={(routeParams) => (
                  <Signup dispatch={dispatch} auth={auth} {...routeParams} />
                )}
              />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Home);
