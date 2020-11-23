import React from "react";

export const required = (value) => {
    if (!value.toString().trim().length) {
        return <span className="error text-danger">This field is required.</span>;
    }
};

export const number = (value, props) => {
    if (!parseInt(value)) {
        return <span className="error text-danger">Enter a valid number.</span>
    }
};