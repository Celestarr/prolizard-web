import Routes from "mibu/constants/routes";
import AuthContainer from "mibu/containers/Auth";
import PrimaryContainer from "mibu/containers/Primary";
import React from "react";
import { Navigate } from "react-router-dom";

const FeedScreen = React.lazy(() => import("mibu/screens/Feed"));
const SettingsScreen = React.lazy(() => import("mibu/screens/Settings"));
const PreferenceSettingsScreen = React.lazy(
  () => import("mibu/screens/Settings/screens/Preferences"),
);
const AccountSettingsScreen = React.lazy(() => import("mibu/screens/Settings/screens/Account"));
const SignInScreen = React.lazy(() => import("mibu/screens/SignIn"));
const SignUpScreen = React.lazy(() => import("mibu/screens/SignUp"));
const UserProfileScreen = React.lazy(() => import("mibu/screens/UserProfile"));

const wrapLazyElement = (Element) => (
  <React.Suspense fallback={<div>Loading...</div>}>
    <Element />
  </React.Suspense>
);

export default function getRoutes(isLoggedIn) {
  return ([
    {
      path: "/",
      element: isLoggedIn ? <PrimaryContainer /> : <Navigate to={Routes.SIGN_IN} />,
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
    },
    {
      path: "/",
      element: !isLoggedIn ? <AuthContainer /> : <Navigate to={Routes.HOME} />,
      children: [
        { path: Routes.SIGN_IN, element: wrapLazyElement(SignInScreen) },
        { path: Routes.SIGN_UP, element: wrapLazyElement(SignUpScreen) },
      ],
    },
  ]);
}
