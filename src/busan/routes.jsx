import GlobalSpinner from "busan/components/GlobalSpinner";
import Routes from "busan/constants/routes";
import AuthContainer from "busan/containers/Auth";
import PrimaryContainer from "busan/containers/Primary";
import React from "react";
import { Navigate } from "react-router-dom";

const AuthCallbackScreen = React.lazy(() => import("busan/screens/AuthCallback"));
// const AuthorizeScreen = React.lazy(() => import("busan/screens/Authorize"));
const FeedScreen = React.lazy(() => import("busan/screens/Feed"));
const SettingsScreen = React.lazy(() => import("busan/screens/Settings"));
const PreferenceSettingsScreen = React.lazy(
  () => import("busan/screens/Settings/screens/Preferences"),
);
const AccountSettingsScreen = React.lazy(() => import("busan/screens/Settings/screens/Account"));
// const SignInScreen = React.lazy(() => import("busan/screens/SignIn"));
// const SignUpScreen = React.lazy(() => import("busan/screens/SignUp"));
const UserProfileScreen = React.lazy(() => import("busan/screens/UserProfile"));

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
