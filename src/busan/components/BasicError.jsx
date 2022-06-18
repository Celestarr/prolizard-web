import React from "react";

const BasicError = ({ error }) => {
  const { message } = error;
  return <div>{message}</div>;
};

export default BasicError;
