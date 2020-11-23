import { useLocation } from "react-router-dom";
const opacityHex = "1A";

export const activeFor = (paths, props) => {
  return paths.includes(props.location.pathname) ? "active" : "";
};

export const useLocationState = (property, defaultValue) => {
  const location = useLocation();
  return location.state && location.state[property] !== undefined
    ? location.state[property]
    : defaultValue;
};

export const getFullName = (firstName, lastName) => {
  let fullName = firstName;
  if (lastName) fullName += " " + lastName;
  return fullName;
};

export const getBgColor = (color) => {
  return `${color}${opacityHex}`;
};
