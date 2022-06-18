// import { Box, Container } from "@mui/material";
import { signUserOut, syncCurrentUserData } from "busan/actions/user";
import {
  currentUserErrorStateSelector,
  currentUserLoadingStateSelector,
  currentUserSelector,
} from "busan/reducers/selectors";
// import * as classes from "busan/styles/classes";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import Header from "./components/Header";

const PrimaryContainer = ({
  pageTitle,
}) => {
  const dispatch = useDispatch();
  const user = useSelector(currentUserSelector);
  const userError = useSelector(currentUserErrorStateSelector);
  const userLoading = useSelector(currentUserLoadingStateSelector);

  if (userLoading) {
    return null;
  }

  if (userError) {
    return "Error occurred.";
  }

  return (
    <>
      <Helmet title={pageTitle} />
      <Header
        onSignOut={(...args) => dispatch(signUserOut(...args))}
        onSyncCurrentUserData={(...args) => dispatch(syncCurrentUserData(...args))}
        user={user}
      />
      <Outlet />
    </>
  );
};

export default PrimaryContainer;
