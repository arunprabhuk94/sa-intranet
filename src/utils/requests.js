import axios from "axios";

const apiUrl =
  process.env.NODE_ENV === "development" ? "http://localhost:3400" : "";

export const apiRequest = async (method, endPoint, token, formData) => {
  const options = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  const url = `${apiUrl}/api${endPoint}`;
  let response;
  if (["get", "delete"].includes(method))
    response = await axios[method](url, options);
  else response = await axios[method](url, formData, options);
  return response;
};
