import React from "react";
import { Link, NavLink, withRouter, useRouteMatch } from "react-router-dom";

import "./LeftMenu.css";

const LeftMenu = (props) => {
  const { path } = useRouteMatch();
  return (
    <div className="left-menu row">
      <div
        className="mb-4 py-2 col-12 h-50px"
        style={{ background: "var(--color-dark-grey)" }}
      >
        <Link
          className="navbar-brand d-flex justify-content-between align-items-center mr-0"
          to={path}
        >
          SA-INTRANET
          <i className="fas fa-stream"></i>
        </Link>
      </div>
      <div className="col-12">
        <ul className="nav nav-pills">
          <li className="nav-item overflow-hidden w-100">
            <NavLink
              className="nav-link d-flex align-items-center pl-2"
              activeClassName="active"
              to={path}
            >
              <i className="fas fa-bullhorn mr-2"></i>
              Announcements
            </NavLink>
          </li>
          <li className="nav-item overflow-hidden w-100">
            <Link
              className="nav-link d-flex align-items-center pl-2"
              to="/logout"
            >
              <i className="fas fa-user-clock mr-2"></i>
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default withRouter(LeftMenu);
