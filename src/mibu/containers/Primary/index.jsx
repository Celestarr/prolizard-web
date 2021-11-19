// import { Box, Container } from "@mui/material";
import { signUserOut, syncCurrentUserData } from "mibu/actions/user";
import {
  currentUserErrorStateSelector,
  currentUserLoadingStateSelector,
  currentUserSelector,
  metadataErrorStateSelector,
  metadataLoadingStateSelector,
} from "mibu/reducers/selectors";
// import * as classes from "mibu/styles/classes";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import Header from "./components/Header";

const PrimaryContainer = ({
  pageTitle,
}) => {
  const dispatch = useDispatch();
  const metaError = useSelector(metadataErrorStateSelector);
  const metaLoading = useSelector(metadataLoadingStateSelector);
  const user = useSelector(currentUserSelector);
  const userError = useSelector(currentUserErrorStateSelector);
  const userLoading = useSelector(currentUserLoadingStateSelector);

  if (userLoading || metaLoading) {
    return null;
  }

  if (userError || metaError) {
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
