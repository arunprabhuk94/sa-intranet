import React from "react";
import { useSelector } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { activeFor } from "../../utils/helper";

const Header = (props) => {
  const auth = useSelector((state) => state.auth);

  return (
    <nav className="navbar navbar-expand-sm shadow row">
      <Link className="navbar-brand" to="/">
        SA-INTRANET
      </Link>
      <ul className="navbar-nav ml-auto">
        {auth.isLoggedIn ? (
          <li
            className={"nav-item text-right " + activeFor(["/logout"], props)}
          >
            <Link className="nav-link" to="/logout">
              Logout
            </Link>
          </li>
        ) : (
          <li className={"nav-item text-right " + activeFor(["/login"], props)}>
            <Link className="nav-link" to="/login">
              Login
            </Link>
          </li>
        )}

        <li className="nav-item ml-4">
          <a
            href="mailto:support@squashapps.com"
            className="navbar-text"
            style={{ color: "#A1A6A9" }}
          >
            <i className="fa fa-envelope mr-2 align-middle"></i>
            support@squashapps.com
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default withRouter(Header);
