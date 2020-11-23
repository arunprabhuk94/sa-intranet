import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setAnnouncementsAction } from "../../../store/actions/announcementActions";
import { apiRequest } from "../../../utils/requests";

const SearchBox = () => {
  const [searchText, setSearchText] = useState("");
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const response = await apiRequest(
          "get",
          "/announcements?searchText=" + searchText,
          auth.user.token
        );
        dispatch(setAnnouncementsAction(response.data));
      } catch (err) {}
    },
    [auth.user.token, searchText, dispatch]
  );

  useEffect(() => {
    let changeTimeout = setTimeout(
      () => handleSubmit({ preventDefault: () => {} }),
      searchText === "" ? 0 : 400
    );
    return () => clearTimeout(changeTimeout);
  }, [searchText, handleSubmit]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group input-group-sm w-auto mr-4">
        <div className="input-group-prepend">
          <span
            className="input-group-text"
            style={{
              background: "var(--color-bg)",
              borderRightColor: "transparent",
            }}
          >
            <i className="fa fa-search font-light-grey-2"></i>
          </span>
        </div>
        <input
          type="text"
          name="searchAnnouncement"
          id="searchAnnouncement"
          className="form-control"
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ borderLeftColor: "transparent" }}
        />
      </div>
    </form>
  );
};

export default SearchBox;
