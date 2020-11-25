import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addCommentAction } from "../../../store/actions/announcementActions";
import { apiRequest } from "../../../utils/requests";

const CommentBox = ({ announcementId }) => {
  const [comment, setComment] = useState("");
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const formRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (auth.user.token) {
      try {
        const response = await apiRequest(
          "post",
          `/announcements/${announcementId}/comment`,
          { token: auth.user.token, formData: { comment } }
        );
        dispatch(addCommentAction(response.data.comment, announcementId));
        setComment("");
      } catch (err) {}
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit({ preventDefault: () => {} });
    } else setComment(e.target.value);
  };

  return (
    <div className="row bg-white mt-auto">
      <form className="d-flex w-100" onSubmit={handleSubmit} ref={formRef}>
        <textarea
          className="comment-box-input p-3 flex-fill font-dark-grey"
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your comment here"
        ></textarea>
        <div className="comment-box-submit-container d-flex pr-3 align-items-center">
          <button className="comment-box-submit font-dark-grey-light-4">
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentBox;
