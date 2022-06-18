import { useAuth0 } from "@auth0/auth0-react";
import routes from "busan/constants/routes";
import React from "react";
import { Navigate as Redirect } from "react-router-dom";

const GuestOnlyRoute = ({ component, ...options }) => {
  const {
    claimCheck = () => true,
  } = options;
  const { isAuthenticated, user } = useAuth0();
  const routeIsAuthenticated = isAuthenticated && claimCheck(user);

  const Component = component;

  console.log(routeIsAuthenticated);

  return !routeIsAuthenticated
    ? Component
    : <Redirect to={routes.HOME} />;
};

export default GuestOnlyRoute;
