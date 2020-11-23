import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import AnnouncementCreate from "./AnnouncementCreate";
import AnnouncementDetails from "./AnnouncementDetails";

const Sidebar = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { path } = useRouteMatch();
  return (
    <>
      <Switch>
        {["/announcement/add", "/announcement/edit/:id"].map((endPoint) => (
          <Route
            key={endPoint}
            path={`${path}${endPoint}`}
            render={(routeParams) => (
              <AnnouncementCreate
                {...routeParams}
                auth={auth}
                dispatch={dispatch}
              />
            )}
          />
        ))}
        <Route
          path={`${path}/announcement/:id`}
          render={(routeParams) => (
            <AnnouncementDetails
              {...routeParams}
              auth={auth}
              dispatch={dispatch}
            />
          )}
        />
      </Switch>
    </>
  );
};

export default Sidebar;
