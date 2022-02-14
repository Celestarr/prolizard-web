import routes from "mibu/constants/routes";
import React from "react";
import { Navigate as Redirect, Route } from "react-router-dom";

const PrivateRoute = (props) => {
  const {
    exact,
    isSignedIn,
    path,
    component,
    onConditionFailureRedirectTo,
    extraCondition,
  } = props;

  if (isSignedIn) {
    if (extraCondition !== undefined && !extraCondition) {
      return <Redirect to={onConditionFailureRedirectTo} />;
    }
    return <Route path={path} component={component} exact={exact} />;
  }
  return <Redirect to={routes.LOGIN} />;
};

export default PrivateRoute;
