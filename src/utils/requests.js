import axios from "axios";

const apiUrl =
  process.env.NODE_ENV === "development" ? "http://localhost:3400" : "";

export const apiRequest = async (
  method,
  endPoint,
  { token, formData, storeToken = false }
) => {
  const options = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  if (storeToken && formData) formData.storeToken = true;
  const url = `${apiUrl}/api${endPoint}`;

  let response;
  if (["get", "delete"].includes(method))
    response = await axios[method](url, options);
  else response = await axios[method](url, formData, options);
  return response;
};

export const setSubmitError = (err, setErrors) => {
  let errorMessage = err.response
    ? err.response.data.errors[0].msg
    : "Error in submitting the form. Please try again.";
  setErrors({
    submitError: errorMessage,
  });
};
