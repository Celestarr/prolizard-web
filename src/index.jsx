import "app/styles/index.scss";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// import enLocale from "date-fns/locale/en-US";
import App from "app/components/App";
// import routes from "app/constants/routes";
import AppSettings from "app/settings";
import store from "app/store";
import reportWebVitals from "app/utils/report-web-vitals";
import { SnackbarProvider } from "notistack";
import React, { useLayoutEffect } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "react-oidc-context";
import { Provider } from "react-redux";
import { BrowserRouter, useLocation } from "react-router-dom";

const onSigninCallback = (user) => {
  console.log("onSigninCallback", user);
  window.history.replaceState(
    {},
    document.title,
    window.location.pathname,
  );
};

const ScrollToTopWrapper = ({ children }) => {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);
  return children;
};

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <SnackbarProvider>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <BrowserRouter>
              <AuthProvider
                authority={AppSettings.OAUTH_BASE_URL}
                client_id={AppSettings.OAUTH_CLIENT_ID}
                onSigninCallback={onSigninCallback}
                redirect_uri={window.location.origin}
                scope="read write"
              >
                <ScrollToTopWrapper>
                  <App />
                </ScrollToTopWrapper>
              </AuthProvider>
            </BrowserRouter>
          </LocalizationProvider>
        </Provider>
      </SnackbarProvider>
    </HelmetProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
