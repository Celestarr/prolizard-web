/* eslint-disable react-hooks/exhaustive-deps */

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { bootApp } from "mibu/actions/app";
import GlobalSpinner from "mibu/components/GlobalSpinner";
import {
  appBootStateSelector,
  currentUserSelector,
  signInStateSelector,
} from "mibu/reducers/selectors";
import getRoutes from "mibu/routes";
import AppSettings from "mibu/settings";
import themes from "mibu/styles/mui-theme";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import {
  useRoutes,
} from "react-router-dom";

const App = () => {
  const dispatch = useDispatch();
  const signedIn = useSelector(signInStateSelector);
  const user = useSelector(currentUserSelector);
  const booted = useSelector(appBootStateSelector);
  const routes = useRoutes(getRoutes(signedIn));
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [uiMode, setUIMode] = useState("system");
  const [themeMode, setThemeMode] = useState("light");

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

  useEffect(() => {
    dispatch(bootApp());
  }, []);

  if (!booted) {
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
