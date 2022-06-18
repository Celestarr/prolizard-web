import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";

const PrivateRoute = ({
  component,
  ...args
}) => {
  const Component = withAuthenticationRequired(component, args);
  return <Component />;
};

export default PrivateRoute;
