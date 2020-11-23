import React from "react";
import { withFormik, Form } from "formik";
import OtpInput from "react-otp-input";
import "./EmailVerification.css";

import { setUserAction } from "../../../store/actions/authActions";
import { apiRequest } from "../../../utils/requests";

const EmailVerification = ({
  errors,
  touched,
  values,
  setValues,
  setErrors,
  isSubmitting,
  handleSubmit,
  setSubmitting,
}) => {
  const handleOtpChange = (otp) => {
    setValues({ verificationCode: otp });
    if (otp.length === 6) {
      setSubmitting(true);
      handleSubmit();
    }
  };
  return (
    <div>
      <h2>We've sent you a mail!</h2>
      <p className="font-light-grey small mt-3">
        To make a workspace from scratch, please confirm your email address.
      </p>
      <Form className="needs-validation mt-5 d-flex align-items-center justify-content-between">
        <div className="form-group font-light-grey-2 flex-grow-1">
          <label htmlFor="verificationCode" className="small">
            Enter your verification code
          </label>
          <OtpInput
            name="verificationCode"
            id="verificationCode"
            containerStyle="verification-code"
            className="verification-code-box"
            value={values.verificationCode}
            onChange={handleOtpChange}
            numInputs={6}
            separator={""}
            errorStyle="verification-code-box-error"
            hasErrored={!!errors.verificationCode}
          />
        </div>
        {isSubmitting && (
          <div className="spinner-border text-primary ml-4" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </Form>
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
    </div>
  );
};
const EmailVerificationFormik = withFormik({
  mapPropsToValues({ verificationCode }) {
    return {
      verificationCode: verificationCode || "",
    };
  },
  async handleSubmit(values, { props, setErrors, resetForm, setSubmitting }) {
    try {
      const formFields = {
        verificationCode: values.verificationCode,
      };
      const response = await apiRequest(
        "post",
        "/users/verifyemail",
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
        verificationCode: "Invalid OTP",
      });
    }
    setSubmitting(false);
  },
})(EmailVerification);

export default EmailVerificationFormik;
