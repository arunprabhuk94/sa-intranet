import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import ReactTags from "react-tag-autocomplete";
import "./ReactTags.css";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

import CloseBtn from "./CloseBtn";
import { setAnnouncementsAction } from "../../../store/actions/announcementActions";
import { apiRequest, setSubmitError } from "../../../utils/requests";

const categories = [
  { id: "announcement", name: "Announcement" },
  { id: "event", name: "Event" },
  { id: "reminder", name: "Reminder" },
];

const AnnouncementCreate = ({
  errors,
  touched,
  isSubmitting,
  setErrors,
  setValues,
  handleChange,
  values,
}) => {
  const auth = useSelector((state) => state.auth);
  const location = useLocation();
  const params = useParams();
  const history = useHistory();
  const emailRef = useRef();

  const [areUsersPresent, setAreUsersPresent] = useState(false);
  const [userSuggestionList, setUserSuggestionList] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const mapUserList = useCallback((user) => {
    const userNew = { ...user };
    userNew.name = userNew.email;
    delete userNew.company;
    delete userNew.email;
    return userNew;
  }, []);

  const fetchAnnouncement = useCallback(
    async (id) => {
      try {
        const response = await apiRequest("get", "/announcements/" + id, {
          token: auth.user.token,
        });
        const { announcement } = response.data;
        setValues({
          id: announcement.id,
          subject: announcement.subject,
          category: announcement.category,
          date: moment(announcement.date).format("YYYY-MM-DD"),
          time: moment(announcement.date).format("HH:mm"),
          location: announcement.location,
          description: announcement.description,
          users: announcement.users,
        });
      } catch (err) {}
    },
    [auth.user.token, setValues]
  );

  useEffect(() => {
    if (location.pathname.includes("/edit")) {
      setIsEditMode(true);
      if (params.id && auth.user.token) {
        fetchAnnouncement(params.id);
      } else {
        history.replace("/app");
      }
    }
  }, [fetchAnnouncement, params, location.pathname, auth.user, history]);

  useEffect(() => {
    if (auth.user.company && auth.user.company.users) {
      setAreUsersPresent(true);
      setUserSuggestionList(auth.user.company.users.map(mapUserList));
    }
  }, [setUserSuggestionList, setAreUsersPresent, auth, mapUserList]);

  const handleTagDelete = (i) => {
    const tags = values.users.slice(0);
    tags.splice(i, 1);
    setValues({ ...values, users: tags });
  };

  const handleTagAdd = (tag) => {
    const alreadyAdded = values.users.some((user) => user.id === tag.id);
    if (!alreadyAdded) {
      let newTag = userSuggestionList.find((user) => user.name === tag.name);
      if (!newTag) newTag = { id: uuidv4(), name: tag.name };
      const tags = values.users.concat(newTag);
      setValues({ ...values, users: tags });
    }
  };

  return (
    <div className="col-12 flex-fill">
      <div className="header mt-4 d-flex justify-content-between align-items-center">
        <h2 className="font-size-md-2 font-weight-bolder mb-0">
          {isEditMode ? "Edit Annoucement" : "Add New Announcement"}
        </h2>
        <CloseBtn />
      </div>
      <Form className="needs-validation mt-3">
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <Field className="form-control" id="subject" name="subject" />
          {touched.subject && errors.subject && (
            <div className="invalid-feedback">{errors.subject}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="category">Subject Category</label>
          <div>
            {categories.map((category, idx) => (
              <label
                className="form-check-label category-radio-container mt-1"
                key={category.id}
              >
                <input
                  type="radio"
                  name="category"
                  id={"category" + idx}
                  className="form-check-input d-none category-radio"
                  value={category.id}
                  checked={
                    values.category
                      ? category.id === values.category
                      : idx === 0
                  }
                  onChange={handleChange}
                />
                <div className="form-check-inline category-radio-text px-3 py-1">
                  {category.name}
                </div>
              </label>
            ))}
          </div>
          {touched.category && errors.category && (
            <div className="invalid-feedback">{errors.category}</div>
          )}
        </div>
        {values.category !== "announcement" && (
          <>
            <div className="row">
              <div className="form-group col-12 col-md-6">
                <label htmlFor="date">
                  {values.category === "event" ? "Date" : "Expires On"}
                </label>
                <Field
                  type="date"
                  name="date"
                  id="date"
                  className="form-control"
                />
                {touched.date && errors.date && (
                  <div className="invalid-feedback">{errors.date}</div>
                )}
              </div>
              {values.category === "event" && (
                <div className="form-group col-12 col-md-6">
                  <label htmlFor="time">Time</label>
                  <Field
                    type="time"
                    name="time"
                    id="time"
                    className="form-control"
                  />
                  {touched.time && errors.time && (
                    <div className="invalid-feedback">{errors.time}</div>
                  )}
                </div>
              )}
            </div>
            {values.category === "event" && (
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <Field className="form-control" id="location" name="location" />
                {touched.location && errors.location && (
                  <div className="invalid-feedback">{errors.location}</div>
                )}
              </div>
            )}
          </>
        )}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            className="form-control"
            id="description"
            value={values.description}
            onChange={handleChange}
            style={{ height: "auto" }}
            rows="3"
          ></textarea>
          {touched.description && errors.description && (
            <div className="invalid-feedback">{errors.description}</div>
          )}
        </div>
        <div className={"form-group "}>
          <label htmlFor="users">Notify To</label>
          <ReactTags
            ref={emailRef}
            allowNew={true}
            delimiters={["Enter", "Tab", ","]}
            placeholderText={
              areUsersPresent
                ? "Enter multi email ids seperated by commas"
                : "No other users in your company right now"
            }
            tags={values.users}
            suggestions={userSuggestionList}
            onDelete={handleTagDelete}
            onAddition={handleTagAdd}
          />

          {touched.users && errors.users && (
            <div className="invalid-feedback">{errors.users}</div>
          )}
        </div>
        {errors.submitError && (
          <div className="alert alert-danger alert-dismissible fade show">
            <button
              type="button"
              className="close"
              data-dismiss="alert"
              onClick={() => setErrors({ submitError: "" })}
            >
              &times;
            </button>
            {errors.submitError}
          </div>
        )}
        <div className="d-flex justify-content-end mt-5">
          <Link to="/app" className="btn btn-default btn-sm mr-3">
            Discard
          </Link>
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={isSubmitting}
          >
            Next
          </button>
        </div>
      </Form>
    </div>
  );
};

const AnnouncementCreateFormik = withFormik({
  mapPropsToValues() {
    const todayDate = moment().format("YYYY-MM-DD");
    const nowTime = moment().format("HH:mm");
    return {
      subject: "",
      date: todayDate,
      time: nowTime,
      location: "",
      category: "announcement",
      description: "",
      users: [],
    };
  },
  async handleSubmit(values, { props, setErrors, resetForm, setSubmitting }) {
    try {
      const formFields = {
        subject: values.subject,
        location: values.location,
        category: values.category,
        description: values.description,
        users: values.users,
      };
      if (values.category === "event") {
        formFields.date = new Date(
          `${values.date} ${values.time}`
        ).toISOString();
      } else if (values.category === "reminder") {
        formFields.date = new Date(`${values.date}`).toISOString();
      }
      const isEditPage =
        props.location.pathname.includes("/edit") && props.match.params.id;
      const method = isEditPage ? "patch" : "post";
      const endPoint =
        "/announcements" + (isEditPage ? "/" + props.match.params.id : "");
      const response = await apiRequest(method, endPoint, {
        token: props.auth.user.token,
        formData: formFields,
      });
      resetForm();
      await props.dispatch(
        setAnnouncementsAction(response.data, props.history)
      );
      props.history.push("/app");
    } catch (err) {
      setSubmitError(err, setErrors);
    }
    setSubmitting(false);
  },
  validationSchema: Yup.object().shape({
    subject: Yup.string().required("Subject is required"),
    category: Yup.string().required("Category is required"),
    location: Yup.string(),
    date: Yup.string(),
    time: Yup.string(),
    description: Yup.string().required("Description is required"),
    users: Yup.array().of(
      Yup.object({
        id: Yup.string(),
        name: Yup.string().email("Enter valid emails"),
      })
    ),
  }),
})(AnnouncementCreate);

export default AnnouncementCreateFormik;
