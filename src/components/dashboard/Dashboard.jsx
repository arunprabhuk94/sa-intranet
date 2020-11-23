import React, { useEffect, useState } from "react";
import {
  Link,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { useLocationState } from "../../utils/helper";
import Announcements from "./announcements/Announcements";
import Sidebar from "./announcements/Sidebar";

import "./Dashboard.css";
import LeftMenu from "./LeftMenu";

const sidebarTransitionTime = 300;

const Dashboard = () => {
  const { path } = useRouteMatch();
  const location = useLocation();

  const title = useLocationState("title", "Announcements");
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    useLocationState("isSidebarOpen", false)
  );

  useEffect(() => {
    const isAnnouncementPage = location.pathname.includes(
      `${path}/announcement/`
    );
    setIsSidebarOpen(isAnnouncementPage);
  }, [setIsSidebarOpen, location.pathname, path]);

  return (
    <div className="row dashboard-container">
      <div className="col-sm-4 col-md-3 col-lg-2 left-menu">
        <LeftMenu />
      </div>
      <div className="col-sm-8 col-md-9 col-lg-10">
        <nav className="navbar navbar-expand-sm row h-50px">
          <div className="font-dark-grey font-weight-bolder">{title}</div>
        </nav>
        <div className="dashboard-contents pt-3 row position-relative">
          <Switch>
            <Route
              path={path}
              render={(routeParams) => <Announcements {...routeParams} />}
            />
          </Switch>
        </div>
        <CSSTransition
          in={isSidebarOpen}
          timeout={sidebarTransitionTime}
          classNames="fade"
          unmountOnExit
        >
          <Link className="modal-bg-overlay" to="/app"></Link>
        </CSSTransition>
        <CSSTransition
          in={isSidebarOpen}
          timeout={sidebarTransitionTime}
          classNames="slide-from-right"
          unmountOnExit
        >
          <div
            className="dashboard-sidebar col-12 col-md-6 col-lg-4 d-flex align-items-stretch"
            style={{ overflowY: "auto" }}
          >
            <Sidebar />
          </div>
        </CSSTransition>
      </div>
    </div>
  );
};

export default Dashboard;
