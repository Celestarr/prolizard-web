/* eslint-disable react-hooks/exhaustive-deps */

import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { bootApp } from "mibu/actions/app";
import {
  appBootStateSelector,
  currentUserSelector,
  signInStateSelector,
} from "mibu/reducers/selectors";
import getRoutes from "mibu/routes";
import AppSettings from "mibu/settings";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import {
  useRoutes,
} from "react-router-dom";

const defaultThemes = {
  dark: createTheme({ palette: { mode: "dark" } }),
  light: createTheme({ palette: { mode: "light" } }),
};

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
    () => createTheme({
      palette: {
        // background: {
        //   default: "#F6F7F9",
        // },
        mode: themeMode,
      },
      typography: {
        fontFamily: "'Roboto', sans-serif",
      },
      components: {
        MuiAlertTitle: {
          styleOverrides: {
            root: {
              marginTop: -2,
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: defaultThemes[themeMode].palette.background.default,
              color: defaultThemes[themeMode].palette.text.primary,
            },
          },
        },
      },
    }),
    [themeMode],
  );

  useEffect(() => {
    dispatch(bootApp());
  }, []);

  if (!booted) {
    return <div>Loading...</div>;
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
