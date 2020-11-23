import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import AnnouncementList from "./AnnouncementList";
import SearchBox from "./SearchBox";

const Announcements = () => {
  const { path } = useRouteMatch();
  return (
    <div className="w-100">
      <div className="col-12 d-flex justify-content-end mb-3">
        <SearchBox />
        <Link
          to={{
            pathname: `${path}/announcement/add`,
            state: { isSidebarOpen: true },
          }}
          className="btn btn-sm btn-primary"
        >
          <i className="fa fa-plus mr-2"></i>
          Add Announcement
        </Link>
      </div>
      <div className="col-12">
        <AnnouncementList />
      </div>
    </div>
  );
};

export default Announcements;
