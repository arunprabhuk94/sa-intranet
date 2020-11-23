import React from "react";
import { Link } from "react-router-dom";

const CloseBtn = (prop) => {
  return (
    <Link
      className={"close cursor-pointer bg-light px-2 py-1 " + prop.className}
      to={prop.to || "/app"}
    >
      &times;
    </Link>
  );
};

export default CloseBtn;
