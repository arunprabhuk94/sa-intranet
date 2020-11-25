export const SET_ANNOUNCEMENTS = "SET_ANNOUNCEMENTS";
export const ADD_ANNOUNCEMENT = "ADD_ANNOUNCEMENT";
export const UPDATE_ANNOUNCEMENT = "UPDATE_ANNOUNCEMENT";
export const ADD_COMMENT = "ADD_COMMENT";

export const setAnnouncementsAction = ({ announcements }) => {
  return { type: SET_ANNOUNCEMENTS, payload: { announcements } };
};

export const addAnnouncementAction = ({ announcement }) => {
  return { type: ADD_ANNOUNCEMENT, payload: { announcement } };
};

export const updateAnnouncementAction = ({ announcements }) => {
  return { type: UPDATE_ANNOUNCEMENT, payload: { announcements } };
};

export const addCommentAction = (comment, announcementId) => {
  return { type: ADD_COMMENT, payload: { comment, announcementId } };
};
