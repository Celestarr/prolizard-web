import "busan/styles/index.scss";

import AdapterMoment from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
// import enLocale from "date-fns/locale/en-US";
import App from "busan/components/App";
// import routes from "busan/constants/routes";
import AppSettings from "busan/settings";
import store from "busan/store";
import reportWebVitals from "busan/utils/report-web-vitals";
import { SnackbarProvider } from "notistack";
import React from "react";
import ReactDOM from "react-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "react-oidc-context";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

const onSigninCallback = (user) => {
  console.log("onSigninCallback", user);
  window.history.replaceState(
    {},
    document.title,
    window.location.pathname,
  );
};

ReactDOM.render(
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
                <App />
              </AuthProvider>
            </BrowserRouter>
          </LocalizationProvider>
        </Provider>
      </SnackbarProvider>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
