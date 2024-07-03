import {
  Box,
  Toolbar,
} from "@mui/material";
import { signUserOut, syncCurrentUserData } from "app/actions/user";
import { DRAWER_WIDTH } from "app/constants/ui.ts";
import {
  currentUserErrorStateSelector,
  currentUserLoadingStateSelector,
  currentUserSelector,
} from "app/reducers/selectors";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import Drawer from "./components/Drawer.tsx";
import Header from "./components/Header";

function PrimaryContainer({
  pageTitle,
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const dispatch = useDispatch();
  const user = useSelector(currentUserSelector);
  const userError = useSelector(currentUserErrorStateSelector);
  const userLoading = useSelector(currentUserLoadingStateSelector);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

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
        handleDrawerToggle={handleDrawerToggle}
        onSignOut={(...args) => dispatch(signUserOut(...args))}
        onSyncCurrentUserData={(...args) => dispatch(syncCurrentUserData(...args))}
        user={user}
      />
      <Drawer
        handleDrawerClose={handleDrawerClose}
        handleDrawerTransitionEnd={handleDrawerTransitionEnd}
        mobileOpen={mobileOpen}
      />
      <Box
        component="main"
        sx={{ flexGrow: 1, marginLeft: { md: `${DRAWER_WIDTH}px` } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </>
  );
}

export default PrimaryContainer;
