import React, { useState } from "react";
import { Link } from "react-router-dom";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import { setUserAction } from "../../../store/actions/authActions";
import { apiRequest } from "../../../utils/requests";

const Login = ({
  loginPage,
  errors,
  touched,
  isSubmitting,
  history,
  setErrors,
}) => {
  const [isPwdType, setIsPwdType] = useState(true);

  return (
    <div className="col-12 flex-fill">
      <h2 className="font-weight-bolder font-dark-grey">Login to your app</h2>
      <p className="font-light-grey small mt-3">
        To make a workspace from scratch, please confirm your email address.
      </p>
      <Form className="needs-validation mt-5">
        <div className="form-group">
          <label htmlFor="email">User Name</label>
          <Field
            type="email"
            name="email"
            className="form-control"
            placeholder="Enter email"
            id="email"
          />
          {touched.email && errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="pwd">Password</label>
          <div className="input-group">
            <Field
              type={isPwdType ? "password" : "text"}
              name="password"
              className="form-control"
              placeholder="Enter password"
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
        <div className="d-flex justify-content-between align-items-center">
          <div className="form-check">
            <label className="form-check-label font-dark-grey small">
              <Field
                type="checkbox"
                name="rememberMe"
                className="form-check-input mt-1"
                id="rememberMe"
              />
              Remember Me
            </label>
          </div>
          <Link to="/" className="small">
            Forgot Password?
          </Link>
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
          Log In
        </button>
      </Form>
    </div>
  );
};

const LoginFormik = withFormik({
  mapPropsToValues({ email, password, rememberMe }) {
    return {
      email: email || "",
      password: password || "",
      rememberMe: rememberMe || false,
    };
  },
  async handleSubmit(values, { props, setErrors, resetForm, setSubmitting }) {
    try {
      const formFields = {
        email: values.email,
        password: values.password,
      };
      const response = await apiRequest(
        "post",
        "/users/login",
        null,
        formFields
      );
      resetForm();
      if (response.data.users)
        response.data.user.company.users = response.data.users;
      props.dispatch(
        setUserAction(response.data, props.history, values.rememberMe)
      );
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
    email: Yup.string().email("Invalid email").required("Email is required"),
  }),
})(Login);

export default LoginFormik;
