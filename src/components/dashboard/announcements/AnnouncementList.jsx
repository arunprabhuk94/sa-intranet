import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";

import { setAnnouncementsAction } from "../../../store/actions/announcementActions";
import { getBgColor } from "../../../utils/helper";
import { apiRequest } from "../../../utils/requests";

const AnnouncementList = () => {
  const { announcements } = useSelector((state) => state.announcements);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();

  const fetchAnnouncements = useCallback(async () => {
    try {
      const response = await apiRequest("get", "/announcements", {
        token: auth.user.token,
      });
      dispatch(setAnnouncementsAction(response.data));
    } catch (err) {}
  }, [auth.user.token, dispatch]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const openAnnouncementDetails = (announcementId, e) => {
    const { classList } = e.target;
    if (
      !classList.contains("edit-announcement-icon") &&
      !classList.contains("edit-announcement")
    ) {
      history.push(`/app/announcement/${announcementId}`);
    }
  };

  return (
    <div className="w-100">
      {announcements.map((announcement) => {
        const ownerName = announcement.owner.name;
        const randomColor = announcement.owner.color;
        const randomColorBg = getBgColor(randomColor);
        return (
          <div
            className="border p-3 card cursor-pointer flex-row justify-content-stretch align-items-start mb-3 font-dark-grey text-decoration-none"
            key={announcement.id}
            onClick={openAnnouncementDetails.bind(null, announcement.id)}
          >
            <div
              className="mr-3 rounded-circle profile-icon-container text-uppercase d-flex justify-content-center align-items-center"
              title={ownerName}
              style={{
                backgroundColor: randomColorBg,
                color: randomColor,
              }}
            >
              {ownerName && ownerName[0]}
            </div>
            <div className="media-body font-size-md">
              <div className="d-flex align-items-center">
                <h6 className="mr-auto font-weight-bold">
                  {announcement.subject}
                </h6>
                {announcement.owner.id === auth.user.id && (
                  <Link
                    to={{
                      pathname: "/app/announcement/edit/" + announcement.id,
                      state: { isSidebarOpen: true },
                    }}
                    className="edit-announcement font-dark-grey-light-3 mr-3 px-2 cursor-pointer"
                  >
                    <i className="fas fa-pen edit-announcement-icon"></i>
                  </Link>
                )}
                {announcement.comments && announcement.comments.length > 0 && (
                  <div className="comments-count  font-dark-grey-light-3 mr-4">
                    <i className="far fa-comment-dots mr-1"></i>
                    {announcement.comments.length}
                  </div>
                )}
                <div className="posted-date font-dark-grey-light-3">
                  {moment(announcement.updatedAt).format("DD MMM, YYYY")}
                </div>
              </div>
              <p>{announcement.description}</p>
              {announcement.category !== "announcement" && (
                <div
                  className="d-flex mt-4 pt-3"
                  style={{
                    borderTop: "1px solid var(--color-light-grey-light-4)",
                  }}
                >
                  <div className="font-weight-600">
                    <i className="fas fa-calendar-alt mr-1 announcment-icon-color"></i>
                    {moment(announcement.date).format("Do MMM, YYYY")}
                  </div>
                  {announcement.category === "event" && (
                    <div className="ml-3 font-weight-600">
                      <i className="fas fa-map-marker-alt mr-1 announcment-icon-color"></i>
                      {announcement.location}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnnouncementList;
