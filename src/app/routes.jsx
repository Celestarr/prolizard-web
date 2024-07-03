import GlobalSpinner from "app/components/GlobalSpinner";
import Routes from "app/constants/routes";
import AuthContainer from "app/containers/Auth";
import PrimaryContainer from "app/containers/Primary";
import React from "react";
import { Navigate } from "react-router-dom";

const AuthCallbackScreen = React.lazy(() => import("app/screens/AuthCallback"));
// const AuthorizeScreen = React.lazy(() => import("app/screens/Authorize"));
const FeedScreen = React.lazy(() => import("app/screens/Feed"));
const SettingsScreen = React.lazy(() => import("app/screens/Settings"));
const PreferenceSettingsScreen = React.lazy(
  () => import("app/screens/Settings/screens/Preferences"),
);
const AccountSettingsScreen = React.lazy(() => import("app/screens/Settings/screens/Account"));
// const SignInScreen = React.lazy(() => import("app/screens/SignIn"));
// const SignUpScreen = React.lazy(() => import("app/screens/SignUp"));
const UserProfileScreen = React.lazy(() => import("app/screens/UserProfile"));

const wrapLazyElement = (Element) => (
  <React.Suspense fallback={<GlobalSpinner />}>
    <Element />
  </React.Suspense>
);

export default function getRoutes(isLoggedIn) {
  if (!isLoggedIn) {
    return [{
      path: "/",
      element: <AuthContainer />,
      children: [
        { path: Routes.AUTH_CALLBACK, element: wrapLazyElement(AuthCallbackScreen) },
      ],
    }];
  }

  return [{
    path: "/",
    element: <PrimaryContainer />,
    children: [
      { path: Routes.HOME, element: wrapLazyElement(FeedScreen) },
      {
        path: Routes.SETTINGS,
        element: wrapLazyElement(SettingsScreen),
        children: [
          { path: Routes.SETTINGS, element: <Navigate to={Routes.SETTINGS_ACCOUNT} /> },
          { path: Routes.SETTINGS_ACCOUNT, element: wrapLazyElement(AccountSettingsScreen) },
          {
            path: Routes.SETTINGS_PREFERENCES,
            element: wrapLazyElement(PreferenceSettingsScreen),
          },
        ],
      },
      { path: Routes.USER_PROFILE, element: wrapLazyElement(UserProfileScreen) },
    ],
  }];
}
