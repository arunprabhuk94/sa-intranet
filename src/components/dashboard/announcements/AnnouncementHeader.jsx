import React from "react";
import moment from "moment";
import { getBgColor } from "../../../utils/helper";
import CloseBtn from "./CloseBtn";

const AnnouncementHeader = ({ announcement, closeBtn, className }) => {
  const ownerName = announcement.owner.name;
  const randomColor = announcement.owner.color;
  const randomColorBg = getBgColor(randomColor);
  return (
    <div
      className={
        "col-12 d-flex justify-content-between align-items-center " + className
      }
    >
      <div
        className="mr-3 rounded-circle profile-icon-container font-weight-bolder small text-uppercase d-flex justify-content-center align-items-center"
        title={ownerName}
        style={{
          backgroundColor: randomColorBg,
          color: randomColor,
        }}
      >
        {ownerName && ownerName[0]}
      </div>
      <h2 className="font-size-md-2 font-weight-bolder mb-0 flex-fill">
        {announcement.subject || ownerName}
      </h2>
      <div className="posted-date font-dark-grey-light-3 mr-2">
        {moment(announcement.updatedAt).format("DD MMM, YYYY")}
      </div>
      {closeBtn && <CloseBtn />}
    </div>
  );
};

export default AnnouncementHeader;
