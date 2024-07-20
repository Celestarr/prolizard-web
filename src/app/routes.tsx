import GlobalSpinner from "app/components/GlobalSpinner";
import Routes from "app/constants/routes";
import AuthContainer from "app/containers/Auth";
import PrimaryContainer from "app/containers/Primary";
import React, { JSX } from "react";
import { Navigate } from "react-router-dom";

const AuthCallbackScreen = React.lazy(() => import("app/screens/AuthCallback"));
const CareerJobTrackerScreen = React.lazy(() => import("app/screens/Career/JobTracker"));
// const FeedScreen = React.lazy(() => import("app/screens/Feed"));
// const SettingsScreen = React.lazy(() => import("app/screens/Settings"));
// const PreferenceSettingsScreen = React.lazy(
//   () => import("app/screens/Settings/screens/Preferences"),
// );
const RMArticleSearchScreen = React.lazy(() => import("app/screens/ReferenceManagement/ArticleSearch"));
// const AccountSettingsScreen = React.lazy(() => import("app/screens/Settings/screens/Account"));
const UserProfileScreen = React.lazy(() => import("app/screens/UserProfile"));

const wrapLazyElement = (Element: React.LazyExoticComponent<() => JSX.Element | null>) => (
  <React.Suspense fallback={<GlobalSpinner />}>
    <Element />
  </React.Suspense>
);

export default function getRoutes(isLoggedIn: boolean) {
  if (!isLoggedIn) {
    return [{
      path: Routes.HOME,
      element: <AuthContainer />,
      children: [
        { path: Routes.AUTH_CALLBACK, element: wrapLazyElement(AuthCallbackScreen) },
      ],
    }];
  }

  return [{
    path: Routes.HOME,
    element: <PrimaryContainer />,
    children: [
      { path: Routes.HOME, element: null },
      { // /career
        path: Routes.CAREER,
        element: null,
        children: [
          { path: Routes.CAREER, element: <Navigate to={Routes.CAREER_JOB_TRACKER} /> },
          { path: Routes.CAREER_JOB_TRACKER, element: wrapLazyElement(CareerJobTrackerScreen) },
        ],
      },
      { // /rm
        path: Routes.RM,
        element: null,
        children: [
          { path: Routes.RM, element: <Navigate to={Routes.RM_ARTICLE_SEARCH} /> },
          { path: Routes.RM_ARTICLE_SEARCH, element: wrapLazyElement(RMArticleSearchScreen) },
        ],
      },
      // { // /settings
      //   path: Routes.SETTINGS,
      //   element: wrapLazyElement(SettingsScreen),
      //   children: [
      //     { path: Routes.SETTINGS, element: <Navigate to={Routes.SETTINGS_ACCOUNT} /> },
      //     { path: Routes.SETTINGS_ACCOUNT, element: wrapLazyElement(AccountSettingsScreen) },
      //     {
      //       path: Routes.SETTINGS_PREFERENCES,
      //       element: wrapLazyElement(PreferenceSettingsScreen),
      //     },
      //   ],
      // },
      { path: Routes.USER_PROFILE, element: wrapLazyElement(UserProfileScreen) },
    ],
  }];
}
