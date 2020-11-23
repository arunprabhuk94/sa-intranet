import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import AnnouncementHeader from "./AnnouncementHeader";
import CommentBox from "./CommentBox";

const AnnouncementDetails = () => {
  const { announcements } = useSelector((state) => state.announcements);
  const params = useParams();
  const announcement = announcements.find(
    (announcement) => announcement.id === params.id
  );
  if (!announcement) return null;
  return (
    <div className="flex-fill font-size-md d-flex flex-column">
      <div className="row header mt-3 pb-2 border border-bottom">
        <AnnouncementHeader announcement={announcement} closeBtn={true} />
      </div>
      <div className="row my-3">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <h2 className="font-size-md-2 font-weight-bolder mb-0 flex-fill">
            Comments
          </h2>
          <div className="posted-date font-dark-grey-light-3 mr-2">
            {announcement.comments && announcement.comments.length} replies
          </div>
        </div>
      </div>
      {announcement.comments &&
        announcement.comments.map((comment) => {
          return (
            <div
              className="row justify-content-stretch align-items-start mb-3 border border-bottom"
              key={comment._id}
            >
              <AnnouncementHeader announcement={comment} className="mb-2" />
              <div className="col-12">
                <p className="font-dark-grey font-size-md">{comment.comment}</p>
              </div>
            </div>
          );
        })}
      <CommentBox announcementId={announcement.id} />
    </div>
  );
};

export default AnnouncementDetails;
