import React, { useState } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import { setUserAction } from "../../../store/actions/authActions";
import { apiRequest } from "../../../utils/requests";
import { getFullName } from "../../../utils/helper";

const PasswordCreation = ({
  errors,
  touched,
  isSubmitting,
  history,
  setErrors,
}) => {
  const [isPwdType, setIsPwdType] = useState(true);

  return (
    <div className="col-12 flex-fill">
      <h2 className="font-weight-bolder font-dark-grey">
        Create Personal Password
      </h2>
      <p className="font-light-grey small mt-3">
        To make a workspace from scratch, please confirm your email address.
      </p>
      <Form className="needs-validation mt-5">
        <div className="row">
          <div className="form-group col-sm-6">
            <label htmlFor="firstName">First Name</label>
            <Field
              name="firstName"
              className="form-control"
              placeholder="John"
              id="firstName"
            />
            {touched.firstName && errors.firstName && (
              <div className="invalid-feedback">{errors.firstName}</div>
            )}
          </div>
          <div className="form-group col-sm-6">
            <label htmlFor="lastName">Last Name</label>
            <Field
              name="lastName"
              className="form-control"
              placeholder="Smith"
              id="lastName"
            />
            {touched.lastName && errors.lastName && (
              <div className="invalid-feedback">{errors.lastName}</div>
            )}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-group">
            <Field
              type={isPwdType ? "password" : "text"}
              name="password"
              className="form-control"
              placeholder="Enter your password"
              id="password"
            />
            <div
              className="input-group-append"
              style={{ cursor: "pointer" }}
              onClick={() => setIsPwdType(!isPwdType)}
            >
              <span className="input-group-text font-dark-grey-light-2">
                <i className="fa fa-eye"></i>
              </span>
            </div>
          </div>
          {touched.password && errors.password && (
            <div className="invalid-feedback">{errors.password}</div>
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
        <button
          type="submit"
          className="btn btn-primary mt-4"
          disabled={isSubmitting}
        >
          Next
        </button>
      </Form>
    </div>
  );
};

const PasswordCreationFormik = withFormik({
  mapPropsToValues({ firstName, lastName, password }) {
    return {
      firstName: firstName || "",
      lastName: lastName || "",
      password: password || "",
    };
  },
  async handleSubmit(values, { props, setErrors, resetForm, setSubmitting }) {
    try {
      const formFields = {
        name: getFullName(values.firstName, values.lastName),
        password: values.password,
      };
      const response = await apiRequest(
        "post",
        "/users/setpassword",
        props.auth.user.token,
        formFields
      );

      resetForm();
      props.dispatch(setUserAction(response.data, props.history));
    } catch (err) {
      let errorMessage = err.response
        ? err.response.data.errors[0].msg
        : "Error in submitting the form. Please try again.";
      setErrors({
        submitError: errorMessage,
      });
    }
    setSubmitting(false);
  },
  validationSchema: Yup.object().shape({
    firstName: Yup.string()
      .min(3, "Minimum 3 characters!")
      .max(50, "Maximum 50 characters!")
      .required("First Name is required"),
    lastName: Yup.string()
      .min(3, "Minimum 3 characters!")
      .max(50, "Maximum 50 characters!")
      .required("Last Name is required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters!")
      .max(50, "Maximum 50 characters!")
      .required("Password is required"),
  }),
})(PasswordCreation);

export default PasswordCreationFormik;
