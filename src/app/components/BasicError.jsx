import React from "react";

function BasicError({ error }) {
  const { message } = error;
  return <div>{message}</div>;
}

export default BasicError;
