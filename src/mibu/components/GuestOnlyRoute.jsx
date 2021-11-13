import routes from "mibu/constants/routes";
import React from "react";
import { Navigate as Redirect, Route } from "react-router-dom";

const GuestOnlyRoute = (props) => {
  const {
    isSignedIn,
    path,
    component,
    exact,
  } = props;

  return !isSignedIn
    ? (
      <Route path={path} component={component} exact={exact} />
    )
    : <Redirect to={routes.HOME} />;
};

export default GuestOnlyRoute;
