import React from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import { setUserAction } from "../../../store/actions/authActions";
import { apiRequest } from "../../../utils/requests";

const Signup = ({ errors, touched, isSubmitting, setErrors }) => {
  return (
    <div className="col-12 flex-fill">
      <h2 className="font-weight-bolder font-dark-grey">
        Make Your Life Easy with Intranet!
      </h2>
      <p className="font-light-grey small">
        To make a workspace from scratch, please confirm your email address.
      </p>
      <Form className="needs-validation mt-4">
        <div className="form-group font-light-grey-2">
          <label htmlFor="email" className="small">
            Email Address
          </label>
          <Field
            type="email"
            name="email"
            className="form-control"
            placeholder="Enter email"
            id="email"
          />
          {touched.email && errors.email && (
            <div className="invalid-feedback mt-2">{errors.email}</div>
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
          Confirm Email
        </button>
      </Form>
    </div>
  );
};

const SignupFormik = withFormik({
  mapPropsToValues({ email }) {
    return {
      email: email || "",
    };
  },
  async handleSubmit(values, { props, setErrors, resetForm, setSubmitting }) {
    try {
      const formFields = {
        email: values.email,
      };
      const response = await apiRequest(
        "post",
        "/users/signup",
        null,
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
    email: Yup.string().email("Invalid email").required("Email is required"),
  }),
})(Signup);

export default SignupFormik;
