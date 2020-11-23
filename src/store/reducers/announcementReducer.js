import {
  UPDATE_ANNOUNCEMENT,
  ADD_ANNOUNCEMENT,
  SET_ANNOUNCEMENTS,
  ADD_COMMENT,
} from "../actions/announcementActions";

const initialState = {
  announcements: [],
  users: [],
};

const referralReducer = (state = initialState, action) => {
  let newAnnouncements, announcementIdx;
  switch (action.type) {
    case SET_ANNOUNCEMENTS:
      newAnnouncements = [...action.payload.announcements];
      return { ...state, announcements: newAnnouncements };
    case ADD_ANNOUNCEMENT:
      let { announcement: newAnnouncement } = action.payload;
      newAnnouncements = [...state.announcements, newAnnouncement];
      return { ...state, announcements: newAnnouncements };
    case UPDATE_ANNOUNCEMENT:
      let { announcement: updatedAnnouncement } = action.payload;
      announcementIdx = state.announcements.findIndex(
        (ann) => ann.id === updatedAnnouncement.id
      );
      newAnnouncements = [...state.announcements];
      newAnnouncements[announcementIdx] = updatedAnnouncement;
      return { ...state, announcements: newAnnouncements };
    case ADD_COMMENT:
      const { comment } = action.payload;
      const announcementId = action.payload.announcementId;
      announcementIdx = state.announcements.findIndex(
        (ann) => ann.id === announcementId
      );
      newAnnouncements = [...state.announcements];
      const newComments = [
        ...(newAnnouncements[announcementIdx].comments || []),
      ];
      newComments.push(comment);
      newAnnouncements[announcementIdx].comments = newComments;
      return { ...state, announcements: newAnnouncements };
    default:
      return state;
  }
};

export default referralReducer;
