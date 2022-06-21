/* eslint-disable react-hooks/exhaustive-deps */
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { bootApp } from "busan/actions/app";
import GlobalSpinner from "busan/components/GlobalSpinner";
import {
  appBootStateSelector,
  appSignInTriggerStateSelector,
  currentUserSelector,
} from "busan/reducers/selectors";
import getRoutes from "busan/routes";
import AppSettings from "busan/settings";
import themes from "busan/styles/mui-theme";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "react-oidc-context";
import { useDispatch, useSelector } from "react-redux";
import {
  useRoutes,
} from "react-router-dom";

const App = () => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const booted = useSelector(appBootStateSelector);
  const shouldTriggerSignIn = useSelector(appSignInTriggerStateSelector);
  const user = useSelector(currentUserSelector);
  const routes = useRoutes(getRoutes(auth.isAuthenticated));
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [uiMode, setUIMode] = useState("system");
  const [themeMode, setThemeMode] = useState("light");

  useEffect(() => {
    if (!auth.isAuthenticated && !auth.isLoading && !auth.error) {
      auth.signinRedirect();
    } else if (!auth.isLoading) {
      dispatch(bootApp(auth.isAuthenticated));
    }
  }, [auth.error, auth.isAuthenticated, auth.isLoading, auth.signinRedirect]);

  useEffect(() => {
    if (booted && shouldTriggerSignIn) {
      auth.signinRedirect();
    }
  }, [booted, shouldTriggerSignIn]);

  useEffect(() => {
    if (user) {
      if (user.preferences.ui_mode !== uiMode) {
        setUIMode(user.preferences.ui_mode);
      }
    }
  }, [user]);

  useEffect(() => {
    if (uiMode !== themeMode) {
      if (uiMode === "system") {
        setThemeMode(prefersDarkMode ? "dark" : "light");
      } else {
        setThemeMode(uiMode);
      }
    }
  }, [uiMode]);

  const theme = useMemo(
    () => themes[themeMode],
    [themeMode],
  );

  // ["signinSilent", "signinRedirect"].includes(auth.activeNavigator) || auth.isLoading
  if (!booted || shouldTriggerSignIn) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <GlobalSpinner />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Helmet
        titleTemplate={`%s | ${AppSettings.APP_NAME}`}
      />

      {routes}
    </ThemeProvider>
  );
};

export default App;
