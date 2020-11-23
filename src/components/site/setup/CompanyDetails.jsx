import React from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import { setUserAction } from "../../../store/actions/authActions";
import { apiRequest } from "../../../utils/requests";

const CompanyDetails = ({
  errors,
  touched,
  isSubmitting,
  history,
  setErrors,
}) => {
  return (
    <div className="col-12 flex-fill">
      <h2 className="font-weight-bolder font-dark-grey">
        Setup Your Application
      </h2>
      <p className="font-light-grey small mt-3">
        To make a workspace from scratch, please confirm your email address.
      </p>
      <Form className="needs-validation mt-5">
        <div className="form-group">
          <label htmlFor="companyName">Company Name</label>
          <Field
            name="companyName"
            className="form-control"
            placeholder="Enter Your Company Name"
            id="companyName"
          />
          {touched.companyName && errors.companyName && (
            <div className="invalid-feedback">{errors.companyName}</div>
          )}
        </div>
        <div className="row">
          <div className="form-group col-sm-6">
            <label htmlFor="location">Location</label>
            <Field
              name="location"
              className="form-control"
              placeholder="Enter Your Location"
              id="location"
            />
            {touched.location && errors.location && (
              <div className="invalid-feedback">{errors.location}</div>
            )}
          </div>
          <div className="form-group col-sm-6">
            <label htmlFor="noOfEmployees">No. of Employees</label>
            <Field
              name="noOfEmployees"
              className="form-control"
              placeholder="Enter the No. of Employees"
              id="noOfEmployees"
            />
            {touched.noOfEmployees && errors.noOfEmployees && (
              <div className="invalid-feedback">{errors.noOfEmployees}</div>
            )}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="domainName">Domain Name</label>
          <div className="input-group">
            <Field
              name="domainName"
              className="form-control"
              placeholder="Enter the Domain Name"
              id="domainName"
            />
            <div className="input-group-append">
              <span className="input-group-text font-dark-grey-light-2">
                .intranet.com
              </span>
            </div>
          </div>
          {touched.domainName && errors.domainName && (
            <div className="invalid-feedback">{errors.domainName}</div>
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

const CompanyDetailsFormik = withFormik({
  mapPropsToValues({ companyName, locationName, noOfEmployees, domainName }) {
    return {
      companyName: companyName || "",
      location: locationName || "",
      noOfEmployees: noOfEmployees || 0,
      domainName: domainName || "",
    };
  },
  async handleSubmit(values, { props, setErrors, resetForm, setSubmitting }) {
    try {
      const formFields = {
        companyName: values.companyName,
        location: values.location,
        noOfEmployees: values.noOfEmployees,
        domainName: values.domainName + ".intranet.com",
      };
      const response = await apiRequest(
        "post",
        "/users/setcompanydetails",
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
    companyName: Yup.string().required("Company Name is required"),
    location: Yup.string().required("Location is required"),
    noOfEmployees: Yup.number("Enter a valid number").min(
      1,
      "Employee count must be non zero"
    ),
    domainName: Yup.string().required("Domain Name is required"),
  }),
})(CompanyDetails);

export default CompanyDetailsFormik;
