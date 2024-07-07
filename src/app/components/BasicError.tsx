import React from "react";

interface BasicErrorProps {
  error: Error;
}

export default function BasicError({ error }: BasicErrorProps) {
  const { message } = error;
  return <div>{message}</div>;
}
