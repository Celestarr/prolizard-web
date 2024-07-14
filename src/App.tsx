import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import BasicError from "app/components/BasicError";
import GlobalSpinner from "app/components/GlobalSpinner";
import getRoutes from "app/routes";
import {
  useGetUserProfileByIdQuery,
} from "app/services/user-profiles";
import AppSettings from "app/settings";
import themes from "app/styles/mui-theme";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { hasAuthParams, useAuth } from "react-oidc-context";
import {
  useRoutes,
} from "react-router-dom";

export default function App() {
  const auth = useAuth();
  const [hasTriedSignin, setHasTriedSignin] = React.useState(false);
  const routes = useRoutes(getRoutes(auth.isAuthenticated));
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [themeMode, setThemeMode] = useState<"dark" | "light">("light");
  const {
    data: user,
    error,
    isLoading,
  } = useGetUserProfileByIdQuery("me", { skip: !auth.isAuthenticated });

  // Automatically sign-in
  React.useEffect(() => {
    if (
      !hasAuthParams()
      && !auth.isAuthenticated
      && !auth.activeNavigator
      && !auth.isLoading
      && !hasTriedSignin
    ) {
      auth.signinRedirect();
      setHasTriedSignin(true);
    }
  }, [auth, hasTriedSignin]);

  // Auth event listeners: token refresh
  // eslint-disable-next-line arrow-body-style
  React.useEffect(() => {
    // the `return` is important - addAccessTokenExpiring() returns a cleanup function
    return auth.events.addAccessTokenExpiring(() => {
      auth.signinSilent();
    });
  }, [auth]);

  useEffect(() => {
    if (user && user.preferences && user.preferences.ui_mode !== themeMode) {
      if (user.preferences.ui_mode === "system") {
        setThemeMode(prefersDarkMode ? "dark" : "light");
      } else {
        setThemeMode(user.preferences.ui_mode);
      }
    }
  }, [prefersDarkMode, user, themeMode]);

  const theme = useMemo(
    () => themes[themeMode],
    [themeMode],
  );

  if (auth.isLoading || isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <GlobalSpinner />
      </ThemeProvider>
    );
  }

  if (auth.error || error) {
    return (
      <BasicError error={auth.error || new Error("hello")} />
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
}
